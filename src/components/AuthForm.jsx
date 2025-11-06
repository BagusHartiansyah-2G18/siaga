'use client';

export default function AuthForm({ type, email, password, setEmail, setPassword, onSubmit }) {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">{type === "login" ? "Login" : "Register"}</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={onSubmit}
        className={`px-4 py-2 rounded text-white ${type === "login" ? "bg-green-500" : "bg-blue-500"}`}
      >
        {type === "login" ? "Masuk" : "Daftar"}
      </button>
    </div>
  );
}