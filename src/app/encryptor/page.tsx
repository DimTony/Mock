import ProtectedRoute from "@/components/Guard";
import React from "react";

const Encryptor = () => {
  return (
    <ProtectedRoute>
      <div>Encryptor</div>
    </ProtectedRoute>
  );
};

export default Encryptor;
