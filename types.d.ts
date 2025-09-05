interface Books
{
  id:string;
  title:string;
  author:string;
  genre:string;
  rating:number;
  totalCopies:number;
  availableCopies:number;
  description:string;
  coverColor:string;
  coverUrl:string;
  videoUrl:string;
  summary:string;
  createdAt:Date|null
}

interface AuthCredentials{
  fullName:string;
  email:string;
  universityId:number;
  universityCard:string;
  password:string;
}

interface BookParams{
  title:string;
  author:string;
  description:string;
  genre:string;
  rating:number;
  totalCopies:number;
  coverUrl:string;
  coverColor:string;
  videoUrl:string;
  summary:string;
}
interface BorrowBookParams {
  bookId: string;
  userId: string;
}