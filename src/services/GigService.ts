import { createClient, gql, cacheExchange, fetchExchange } from 'urql';

export interface GigOpportunity {
  id: string;
  title: string;
  platform: 'Fiverr' | 'Upwork' | 'Adzuna';
  type: 'Squad' | 'Solo';
  budget: string;
  url: string;
  description?: string;
}

// 1. Initialize GraphQL Client
// Note: Requires UPWORK_API_TOKEN in .env for production
const client = createClient({
  url: 'https://api.upwork.com/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = import.meta.env.VITE_UPWORK_API_TOKEN;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

// 2. Define The "Fixed Price" Query
// Filters for fixed-price jobs to allow for immediate 15% levy calculation
const UPWORK_JOBS_QUERY = gql`
  query SearchFixedPriceJobs($query: String!) {
    marketplaceJobPostingsSearch(
        filter: { 
            q: $query,
            jobType: "fixed-price" 
        }, 
        first: 10
    ) {
      edges {
        node {
          id
          title
          description
          amount {
            amount
            currencyCode
          }
          ciphertext
        }
      }
    }
  }
`;

interface UpworkJobNode {
  id: string;
  title: string;
  description: string;
  amount: {
    amount: string;
    currencyCode: string;
  };
  ciphertext: string;
}

interface UpworkJobEdge {
  node: UpworkJobNode;
}

interface UpworkSearchResponse {
  marketplaceJobPostingsSearch: {
    edges: UpworkJobEdge[];
  };
}

export const fetchGigOpportunities = async (): Promise<GigOpportunity[]> => {
  console.log("GigService: Upwork Link Active.");

  try {
    // execute query
    const result = await client.query<UpworkSearchResponse>(UPWORK_JOBS_QUERY, { query: "technical writing" }).toPromise();

    if (result.error || !result.data) {
      console.warn("Upwork API Signal Weak (Check Token):", result.error?.message || "No data");
      return [];
    }

    // Normalize Data
    return result.data.marketplaceJobPostingsSearch.edges.map((edge: UpworkJobEdge) => ({
      id: edge.node.id,
      title: edge.node.title,
      platform: 'Upwork',
      type: 'Squad', // Defaulting to Squad for these high-value contracts
      budget: `${edge.node.amount.currencyCode} ${edge.node.amount.amount}`,
      url: `https://www.upwork.com/jobs/${edge.node.ciphertext}`,
      description: edge.node.description
    }));

  } catch (error) {
    console.error("GigService System Error:", error);
    return [];
  }
};
