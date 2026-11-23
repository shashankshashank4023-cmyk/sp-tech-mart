import { sampleCatalog } from './sampleCatalog'
export function mapProducts(rows = []) {
  return rows.map((product) => {
    let specs = {}
    try { specs = typeof product.specsJson === 'string' ? JSON.parse(product.specsJson) : product.specsJson || {} } catch { specs = {} }
    return { ...product, oldPrice: Number(product.price), price: Number(product.effectivePrice ?? product.discountPrice ?? product.price), rating: product.rating ?? 4.7, reviews: product.reviews ?? 0, badge: product.stockQty <= 5 ? 'LOW STOCK' : '', image: product.imageUrl, laptopType: product.laptopType || specs.laptopType, specs: Object.values(specs).filter((value) => typeof value === 'string') }
  })
}


