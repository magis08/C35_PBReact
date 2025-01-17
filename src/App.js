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
  const [isOffline, setIsOffline] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const loadMoreRef = useRef(null);
  
  const readData = async (newPage) => {
    if (loading || (totalPage && newPage > totalPage)) return;

    setLoading(true);
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL, {
        params: {
          keyword,
          sortBy: 'name',
          order: sort === 'asc' ? 'ASC' : 'DESC',
          limit: 5,
          page: newPage,
        },
      });

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
    };
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

  const PostUser = (name, phone, onSuccess) => {
    return new Promise((resolve, reject) => {
      if (!name || !phone) {
        console.error("Data tidak lengkap untuk dikirim.");
        reject("Data tidak lengkap untuk dikirim.");
        return;
      }
  
      const newUser = { name, phone, status: 'pending' };
      axios
        .post(process.env.REACT_APP_API_URL, { name, phone })
        .then((response) => {
          const userData = response.data;
          setUsers((prevUsers) => {
            return prevUsers
              .map((user) =>
                user.name === name && user.phone === phone
                  ? { ...user, status: 'sent' } 
                  : user
              );
          });
  
          setPendingData(null);
  
          if (onSuccess) {
            onSuccess();
          }
  
          resolve();
        })
        .catch((error) => {
          console.error("Data gagal ditambahkan", error);
          alert("Data gagal ditambahkan. Simpan data untuk dikirim ulang.");
          setPendingData(newUser); 
  
          reject(error);
        });
    });
  }; 
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log("Koneksi aktif, mencoba kirim data...");
      
      if (pendingData) {
        console.log("Data tertunda ditemukan:", pendingData);
        // Try to resend pending data
        PostUser(pendingData.name, pendingData.phone, () => {
          setPendingData(null); // Clear pending data after successful resend
        });
      }
    };
  
    const handleOffline = () => {
      setIsOffline(true);
    };
  
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  
    if (!navigator.onLine) {
      setIsOffline(true); // Set status offline saat pertama kali mount
    }
  
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pendingData]);  

  const EditUser = (id, name, phone) => {
    axios.put(`${process.env.REACT_APP_API_URL}/${id}`, { name, phone })
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
          return updatedUsers
            .sort((a, b) => sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
            .filter(user => user.name.toLowerCase().includes(keyword.toLowerCase()));
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Data gagal diubah');
      });
  };

  const changeAvatar = (id, avatar) => {
    axios.put(`${process.env.REACT_APP_API_URL}/${id}/avatar`, avatar, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user.id === id) {
              const newAvatarUrl = response.data.avatar
                ? `http://localhost:3000/images/${response.data.avatar}?timestamp=${new Date().getTime()}`
                : null;
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
    axios.delete(`${process.env.REACT_APP_API_URL}/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      })
      .catch(() => alert('Data gagal dihapus'));
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainBoard keyword={keyword} setKeyword={setKeyword} sort={sort} setSort={setSort} users={users} remove={removeUser} edit={EditUser} />}></Route>
        <Route path='/add' element={<AddUser add={PostUser} isOffline={isOffline} pendingData={pendingData}/>}></Route>
        <Route path='/avatar' element={<Avatar avatar={changeAvatar} />}></Route>
      </Routes>

      <div ref={loadMoreRef} style={{ height: '100%', backgroundColor: 'lightgray' }}>
        {loading && <p>'Loading...'</p>}
      </div>
    </Router>
  );
};

export default App;
