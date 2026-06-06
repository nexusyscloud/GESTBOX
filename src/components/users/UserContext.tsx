import React, { createContext, useContext } from 'react';

type UserContextValue = {
  empresa_id: string;
  sucursal_id: string | null;
};

const UserContext = createContext<UserContextValue>({
  empresa_id: '',
  sucursal_id: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 🔹 TEMPORAL (luego vendrá del login)
  const empresa_id = '1427c107-6e37-44fa-8984-cdf39a5b9a62';
  const sucursal_id = null;

  return (
    <UserContext.Provider value={{ empresa_id, sucursal_id }}>
      {children}
    </UserContext.Provider>
  );
};
