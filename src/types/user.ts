export interface IUser {
  id: string;
  name?: string | null;
  email: string;
  createdAt: Date;
}