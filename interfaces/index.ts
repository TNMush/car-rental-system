export interface User {
  email: string;
  password: string;
}

export interface Profile extends LocationInterface {
  id: string;
  name: string;
  profilePicture?: string | null;
  bio?: string | null;
  locationId?: number | null;
}
export interface listingRequestInterface {
  location?: string;
  color?: string;
  model?: string;
  year?: string;
  make?: string;
  type?: string;
  from?: string;
  to?: string;
}

export interface ListingsInterface {
  listedBy: string;
  from: string;
  upTo: string;
  pricing: number;
}

export interface CreateListingInterface
  extends ListingsInterface,
    LocationInterface {}

export interface PatchingListingInterface extends CreateListingInterface {}

export interface LocationInterface {
  id?: string;
  city: string;
  address: string;
}
