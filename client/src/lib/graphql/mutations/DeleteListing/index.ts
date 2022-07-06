import { gql } from "apollo-boost";

export const DELETE_LISTING = gql`
  mutation DeleteListing($input: DeleteListingInput!) {
    deleteListing(input: $input)
  }
`;
