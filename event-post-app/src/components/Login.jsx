// "use client"
// import { useState } from 'react';
// import { useSetAtom } from 'jotai';
// import { currentUserAtom } from '../atoms/currentUserAtom';
// import { fetchCurrentUser } from '../utils/auth';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const setUser = useSetAtom(currentUserAtom);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:3001/api/v1/sessions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('token', data.token);
//         await fetchCurrentUser(setUser);
//       } else {
//         console.error('Failed to log in');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
//       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
//       <button type="submit">Login</button>
//     </form>
//   );
// }