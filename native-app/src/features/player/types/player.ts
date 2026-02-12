export interface BasePlayerDetails {
  id: string;
  firstName: string;
  lastName: string;
  skillLevel: string;
}

export interface Player extends BasePlayerDetails {
  email: string;
  imageUrl?: string;
}
