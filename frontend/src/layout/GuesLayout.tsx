import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function GuesLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <main className="">{children}</main>
    </div>
  );
}
