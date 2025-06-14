'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { fetchSupportedPages } from "@/services/supported-page-services";
import { formatDate } from "@/ultils/helpers";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function BasicTables() {
    const { data: supportedPages, isLoading, error } = useQuery({
        queryKey: ['supportedPages'],
        queryFn: fetchSupportedPages,
    });

    if (error) throw new Error("Lỗi khi tải danh sách người dùng");

    const columns = [
        { header: "Original Name", accessor: "page_name" },
        { header: "Original Id", accessor: "page_id" },
        { header: "Created At", accessor: "created_at", render: (value: string) => formatDate(value) },
        { header: "Updated At", accessor: "updated_at", render: (value: string) => formatDate(value) },
    ];
    console.log("Supported Pages:", supportedPages);
    return (
        <div>
            <PageBreadcrumb pageTitle="Supported Pages" />
            <div className="space-y-6 relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) :
                    <div className={isLoading ? "blur-sm pointer-events-none" : ""}>
                        <BasicTableOne data={supportedPages as any[]} columns={columns} />
                    </div>
                }
            </div>
        </div>
    );
}
