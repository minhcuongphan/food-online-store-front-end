'use client'
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { fetchMerchants } from "@/services/merchant-services";
import { formatDate } from "@/ultils/format-date";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function BasicTables() {
  const { data: merchants, isLoading, error } = useQuery({
    queryKey: ['merchants'],
    queryFn: fetchMerchants,
  });

  if (error) throw new Error("Lỗi khi tải danh sách người dùng");

  const columns = [
    { header: "Email", accessor: "email" },
    { header: "Created At", accessor: "created_at", render: (value: string) => formatDate(value) },
    { header: "Updated At", accessor: "updated_at", render: (value: string) => formatDate(value) },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Merchants" />
      <div className="space-y-6 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) :
          <div className={isLoading ? "blur-sm pointer-events-none" : ""}>
            <BasicTableOne data={merchants as any[]} columns={columns} />
          </div>
        }
      </div>
    </div>
  );
}
