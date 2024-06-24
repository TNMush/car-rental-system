export interface User {
  email: string;
  password: string;
  name: string;
  image?: string;
  profile?: Profile;
}
export interface LoginInterface
  extends Omit<User, "name" | "image" | "profile"> {}

export interface Profile {
  bio?: string;
  location?: string;
  userId: string;
  user: User;
  verificationStatus: boolean;
  proofOfResidence?: string;
  proofOfIdentity?: string;
}
export interface listingRequestInterface {
  location?: string;
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
