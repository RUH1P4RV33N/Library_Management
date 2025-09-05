import React from "react";
import BookCard from "@/components/BookCard";
interface Props {
  title: string;
  books: Books[];
  containerClassName?: string;
}
const BookList = ({title, books,containerClassName}:Props) => {
    if(books.length<2) return

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
      <ul className="book-list">

        {books.map((books) => (
          <BookCard key={books.title} {... books}/>
        ))}
      </ul>
    </section>
  );
};
export default BookList;
