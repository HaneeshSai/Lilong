import React from "react";

export default function SearchResults({ searchResults }) {
  console.log(searchResults);
  return (
    <div className="overflow-x-auto scrollbar-hide whitespace-nowrap">
      {searchResults?.tracks?.items?.map((e, i) => (
        <div key={i} className="inline-block">
          <img
            src={e.album.images.length > 0 ? e.album.images[0].url : null}
            alt="album img"
            className="w-36"
          />
        </div>
      ))}
    </div>
  );
}
