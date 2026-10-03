function SearchStudent({ searchTerm, setSearchTerm }) {
    return (
        <input
            className="search-input"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by ID or name"
        />
    );
}

export default SearchStudent;