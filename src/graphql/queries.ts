import { gql } from '@apollo/client';

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($first: Int = 1000) {
    products(first: $first) {
      nodes {
        __typename
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          displayPrice: price(format: FORMATTED)
          stockStatus
        }
         ... on VariableProduct {
          price
          displayPrice: price(format: FORMATTED)
          stockStatus
        }
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
        # Noskhan (MNSWMC) currency plugin meta — USD price + profit margin
        # _mnswmc_regular_price = base price in USD (e.g. "4300" = $4,300)
        # _mnswmc_active = "yes" if noskhan pricing is enabled for this product
        # _mnswmc_profit_margin = profit percentage applied by the plugin
        # _mnswmc_currency_id = the currency ID (e.g. 12073 for USD)
        metaData {
          key
          value
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG_QUERY = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      __typename
      id
      databaseId
      name
      slug
      description
      ... on SimpleProduct {
        price
        displayPrice: price(format: FORMATTED)
        sku
        stockStatus
      }
      ... on VariableProduct {
        price
        displayPrice: price(format: FORMATTED)
        sku
        stockStatus
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
      # Noskhan (MNSWMC) currency plugin meta — same as above
      metaData {
        key
        value
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS_QUERY = gql`
  query GetCustomerOrders {
    customer {
      orders(first: 100) {
        nodes {
          id
          databaseId
          date
          total
          status
        }
      }
    }
  }
`;
