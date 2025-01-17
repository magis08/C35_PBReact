import TopBoard from "./TopBoard"
import UserCard from "./UserCard"

export default function MainBoard({keyword, setKeyword, sort, setSort, users, remove, edit}) {
    return (
        <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <TopBoard keyword={keyword} setKeyword={setKeyword} sort={sort} setSort={setSort} />
            </div>
            <div className='board'>
                <UserCard users={users} remove={remove} edit={edit} />
            </div>
        </div>
    )
}