import TopBoard from "./TopBoard"
import UserCard from "./UserCard"


export default function MainBoard({keyword, setKeyword, sort, setSort, users, remove, edit}) {
    return (
        <div>
            <div>
                <TopBoard keyword={keyword} setKeyword={setKeyword} sort={sort} setSort={setSort} />
            </div>
            <div className='board'>
                <UserCard users={users} remove={remove} edit={edit} />
            </div>
        </div>
    )
}