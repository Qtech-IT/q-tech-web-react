interface Address {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface UserType {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: Address;
  img_url?: string;
  image?: File | null;
}
