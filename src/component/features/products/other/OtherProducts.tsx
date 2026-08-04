
import { useState } from 'react'
import '../../allcss/products/OtherProducts.css'
import { Label } from '../../../shared/basic/label/Label.tsx'
import { CardLayout } from '../../../shared/cardlayout/CardLayout.tsx'
import { ICardLayoutField } from '../../../shared/allinterface/cardlayout/ICardLayout.ts'
import { IProductCatalogItem } from '../../allinterface/products/IProductContainer.ts'
import { IProductFeature } from '../../allinterface/products/IProductFeature.ts'
import { sampleOtherProducts } from '../../../../sampledata/features/ProductsSampleData.ts'

const FnFormatCurrency = (value: number): string =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const getProductFields = (product: IProductCatalogItem): ICardLayoutField[] => [
    { Name: "", Value: product.ProductName, Header: 1 },
    { Name: "Edition", Value: product.Edition, Header: 2 },
    { Name: "", Value: product.Description },
    { Name: "Price", Value: FnFormatCurrency(product.UnitPrice), Group: "price", Row: 'inline' },
    { Name: "Billing", Value: product.BillingCycle, Group: "price", Row: 'inline' }
];

/* Products/Other has no brochure, so it lists the remaining catalog items. */
const OtherProducts = (otherProductsProps: IProductFeature) => {
    const [selectedProductId, setSelectedProductId] = useState<string>();

    return (
        <div key={otherProductsProps.uniqueName} className='nz-other-products'>
            <div className='nz-sub-header'>
                <Label
                    uniqueName={`${otherProductsProps.uniqueName}-header`}
                    label={otherProductsProps.headerText ?? "Other"}
                    fontWeight='600' />
                <Label
                    uniqueName={`${otherProductsProps.uniqueName}-count`}
                    label={`${sampleOtherProducts.length} product(s)`} />
            </div>
            <div className='nz-other-products-list'>
                {sampleOtherProducts.map((product) => (
                    <CardLayout
                        key={product.ProductID}
                        uniqueName={`${otherProductsProps.uniqueName}-${product.ProductID}`}
                        featureId={otherProductsProps.featureId}
                        data={product}
                        fields={getProductFields(product)}
                        isSelected={selectedProductId === product.ProductID}
                        hideRightMouseMenu={true}
                        keyboardNavigationOrientation={'vertical'}
                        tabIndex={0}
                        onClick={() => setSelectedProductId(product.ProductID)} />
                ))}
            </div>
        </div>
    )
}

export { OtherProducts }
export default OtherProducts
