import { Link } from "react-router-dom";

export default function TopBoard({ keyword, setKeyword, sort, setSort }) {
    const toggleSort = () => {
        const newSort = sort === "asc" ? "desc" : "asc";
        console.log(`Current sort: ${sort}`);
        console.log(`Changing sort to: ${newSort}`);
        setSort(newSort);
    };

    const search = (event) => {
        const { value } = event.target;
        setKeyword(value);
        console.log(`Keyword set to: ${value}`);
    };

    console.log(`Rendered with sort: ${sort}`);

    return (
        <div className="barPosition">
            <button className="btn1" onClick={toggleSort}>
                {sort === "asc" ? (
                    <i className="fa-solid fa-arrow-down-z-a"></i>
                ) : (
                    <i className="fa-solid fa-arrow-down-a-z"></i>
                )}
            </button>
            <input
                type="text"
                value={keyword}
                onInput={search}
                placeholder="search"
            />
            <Link to={"/add"}>
                <button className="btn1">
                    <i className="fa-solid fa-user-plus"></i>
                </button>
            </Link>
        </div>
    );
}
