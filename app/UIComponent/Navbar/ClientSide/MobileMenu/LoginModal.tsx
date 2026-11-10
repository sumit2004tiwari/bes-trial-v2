import { Suspense } from "react";
import dynamic from "next/dynamic";
import React from "react";

const LoginForm = dynamic(() => import("../../../LoginBox/LoginForm"), { ssr: false });

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <Suspense fallback={null}>
          <LoginForm onClose={onClose} />
        </Suspense>
      )}
    </>
  );
}