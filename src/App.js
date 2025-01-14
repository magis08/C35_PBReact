import './App.css'
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Avatar from './components/Avatar';
import MainBoard from './components/Mainboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from './components/AddUser';
import '@fortawesome/fontawesome-free/css/all.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);

  const readData = async (newPage) => {
    if (loading || (totalPage && newPage > totalPage)) return;

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/phonebooks', {
        params: {
          keyword,
          sortBy: 'name',
          order: sort === 'asc' ? 'ASC' : 'DESC',
          limit: 5,
          page: newPage,
        },
      });

      console.log('Response:', response.data.phonebooks);

      const data = response.data.phonebooks;
      const totalPages = response.data.pages;

      setTotalPage(totalPages);

      setUsers((prevUsers) => {
        if (newPage === 1) {
          return data;
        } else {
          return [...prevUsers, ...data];
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page <= totalPage) {
          const newPage = page + 1;
          setPage(newPage);
        }
      },
      {
        rootMargin: '100px',
        threshold: 1.0,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    }

  }, [loading, page, totalPage]);

  useEffect(() => {
    if (page > 1) {
      readData(page);
    }
  }, [page]);  

  useEffect(() => {
    setPage(1);
    readData(1);
  }, [keyword, sort]);

  const PostUser = (name, phone) => {
    axios.post('http://localhost:3000/api/phonebooks', { name, phone })
      .then((response) => {
        console.log('Data added:', response.data);
        const newUser = response.data;

        setUsers((prevUsers) => {
          const updatedUsers = [newUser, ...prevUsers];
          return updatedUsers
            .sort((a, b) => sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
            .filter(user => user.name.toLowerCase().includes(keyword.toLowerCase()));
        });
      })
      .catch(() => {
        alert('Data gagal ditambahkan');
      });
  };

  const EditUser = (id, name, phone) => {
    axios.put(`http://localhost:3000/api/phonebooks/${id}`, { name, phone })
      .then(() => {
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) => {
            if (user.id === id) {
              return {
                ...user,
                name,
                phone,
              };
            }
            return user;
          });

          return updatedUsers.sort((a, b) => {
            if (sort === 'asc') {
              return a.name.localeCompare(b.name);
            } else {
              return b.name.localeCompare(a.name);
            }
          });
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Data gagal diubah');
      });
  };

  const changeAvatar = (id, avatar) => {
    axios.put(`http://localhost:3000/api/phonebooks/${id}/avatar`, avatar, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log('Response data:', response.data);

        setUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user.id === id) {
              const newAvatarUrl = response.data.avatar
                ? `http://localhost:3000/images/${response.data.avatar}?timestamp=${new Date().getTime()}`
                : null;
              console.log('New avatar URL:', newAvatarUrl);
              return {
                ...user,
                avatar: newAvatarUrl,
              };
            }
            return user;
          });
        });
      })
      .catch((err) => {
        console.log(err);
        alert('Avatar gagal diubah');
      });
  };

  const removeUser = (id) => {
    axios.delete(`http://localhost:3000/api/phonebooks/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      })
      .catch(() => alert('Data gagal dihapus'));
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainBoard keyword={keyword} setKeyword={setKeyword} sort={sort} setSort={setSort} users={users} remove={removeUser} edit={EditUser} />}></Route>
        <Route path='/add' element={<AddUser add={PostUser} />}></Route>
        <Route path='/avatar' element={<Avatar avatar={changeAvatar} />}></Route>
      </Routes>

      <div ref={loadMoreRef} style={{ height: '20px', backgroundColor: 'lightgray' }}>
        {loading && <p>'Loading...'</p>}
      </div>
    </Router>
  );
};

export default App;