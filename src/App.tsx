/*
  App entry: Authentication → NzApp with authenticated user.
  Query param "isnew" disables the splash and preloads env config.
*/

import './App.css'
import { AuthSession } from '@n20a/libauth';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Stage } from './stages/IAuthorization';
import { SplashLoader } from './stages/SplashLoader';
import { Authentication } from './stages/Authentication';
import ErrorBoundary from './component/shared/errorboundary/ErrorBoundary';

const NzApp = lazy(() => import('./component/NzApp'));

function App() {
  const isMountedRef = useRef(true);
  const [isNewParam] = useState(() => new URLSearchParams(window.location.search).get("isnew"));

  const [currentStage, setCurrentStage] = useState<Stage>(1);
  const [userData, setUserData] = useState<AuthSession>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loginUserName, setLoginUserName] = useState<string>();
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [authError, setAuthError] = useState<string>();
  const [isEnvReady, setIsEnvReady] = useState(false);

  const callEnvToGetData = async () => {
    try {
      // if (!window.APP_CONFIG?.DEPLOYMENT_N20_API_URL) {
      //   setAuthError("Deployment API URL is missing.");
      //   setIsEnvReady(false);
      //   return;
      // }
      setIsEnvReady(true);
    } catch (error) {
      console.error("Environment fetch failed:", error);
      setAuthError("Failed to load environment configuration.");
      setIsEnvReady(false);
    }
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isNewParam) {
      void callEnvToGetData();
    }
  }, [isNewParam]);

  // Close NZ- tabs when another tab broadcasts signout
  useEffect(() => {
    const channel = new BroadcastChannel('nz-tab-control');

    channel.onmessage = (event) => {
      if (event.data?.action !== 'signout-all-tabs') return;
      if (!document.title.startsWith('NZ-')) return;

      window.sessionStorage.removeItem('session_variables');
      window.close();

      setTimeout(() => {
        if (!window.closed) {
          window.location.replace('about:blank');
        }
      }, 1000);
    };

    return () => {
      channel.close();
    };
  }, []);

  const handleAuthenticationSuccess = async (user: AuthSession) => {
    await callEnvToGetData();
    if (!isMountedRef.current) return;

    setUserData(user);
    setLoginUserName(user.displayName || user.username);
    setCurrentStage(2);
  };

  return (
    <div className="app-container">
      <ErrorBoundary>
        <Suspense
          fallback={
            <SplashLoader
              uniqueName="suspense-fallback"
              allowSplashScreen={false}
              message={null}
              currentStage={currentStage}
              loadingMessage=""
            />
          }
        >
          {currentStage === 1 && (
            <Authentication
              uniqueName="user-authentication"
              onSuccess={handleAuthenticationSuccess}
            />
          )}
          {currentStage === 2 && isEnvReady && userData && (
            <NzApp
              uniqueName="nz-app"
              user={userData}
              onError={setErrorMessage}
              onSuccess={() => setIsAppLoaded(true)}
            />
          )}
        </Suspense>
      </ErrorBoundary>

      {!isAppLoaded && !authError && (
        <SplashLoader
          uniqueName="user-auth-splash"
          allowSplashScreen={!isNewParam}
          message={errorMessage ?? null}
          currentStage={currentStage}
          loadingMessage={loginUserName ?? ""}
        />
      )}

      {authError && (
        <div className="nz-auth-error-overlay">
          <div className="nz-auth-error-box">
            <div className="nz-auth-error-header">
              <span className="nz-auth-error-icon">!</span>
              <span className="nz-auth-error-title">Configuration Failed</span>
            </div>
            <div className="nz-auth-error-body">{authError}</div>
            <div className="nz-auth-error-footer">
              <button
                className="nz-btn nz-btn-primary"
                onClick={() => window.location.replace("about:blank")}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { App }
