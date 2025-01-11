import UserData from "./UserData";

export default function UserCard({ users = [], remove, edit, avatar }) {
    const cards = users.map((item) => (
        <UserData user={item} key={item.id} remove={() => remove(item.id)} edit={edit} avatar={avatar} />
    ))
    return cards
}