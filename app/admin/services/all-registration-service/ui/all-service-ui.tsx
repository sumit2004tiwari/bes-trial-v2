"use client";

import { encryptPayload } from "@/app/_shared/shared-payload-security";
import { activateAndDeactivateRegistrationService } from "@/app/frontend/actions/admin-api";
import { handleApiRequestWithToast } from "@/app/frontend/helper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
} from "@mui/material";
import { useRef, useState } from "react";

type Service = {
  name: string;
  description?: string;
  isActive: boolean;
  service_name: string;
};

type Props = {
  services: Service[];
  onToggle: (service_name: string, value: boolean) => void;
  isPending: boolean;
};

function ServiceTable({ services, onToggle, isPending }: Props) {
  return (
    <TableContainer
      component={Paper}
      className="rounded-lg shadow-md border border-gray-200"
    >
      <Table>
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="font-semibold">Service Name</TableCell>
            <TableCell className="font-semibold">Description</TableCell>
            <TableCell className="font-semibold text-center">Status</TableCell>
            <TableCell className="font-semibold text-center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {services.map((service) => (
            <TableRow key={service.service_name} hover>
              <TableCell className="font-medium">{service.name}</TableCell>

              <TableCell className="text-gray-600">
                {service.description || "—"}
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      service.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {service.isActive ? "Active" : "Disabled"}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <Switch
                  checked={service.isActive}
                  onChange={(e) =>
                    onToggle(service.service_name, e.target.checked)
                  }
                  color="success"
                  disabled={isPending}
                />
              </TableCell>
            </TableRow>
          ))}

          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                No services found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function AllServiceUi({
  services: initialServices,
}: {
  services: Service[];
}) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isPending, setIsPending] = useState(false);
  const isPendingRef = useRef(false);

  const handleToggle = async (serviceName: string, value: boolean) => {
    if (isPendingRef.current) return;

    const payload = { service_name: serviceName, value };
    const encryptedData = encryptPayload(JSON.stringify(payload));

    isPendingRef.current = true;
    setIsPending(true);

    const response = await handleApiRequestWithToast(
      activateAndDeactivateRegistrationService(encryptedData),
      value ? "Service Successfully enabled" : "Service Successfully disabled"
    );

    console.log({ response });
    // Update UI only if response.status is true
    if (response?.status === true) {
      setServices((prev) =>
        prev.map((svc) =>
          svc.service_name === serviceName ? { ...svc, isActive: value } : svc
        )
      );
    }

    isPendingRef.current = false;
    setIsPending(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Service Management</h2>
      <ServiceTable
        services={services}
        onToggle={handleToggle}
        isPending={isPending}
      />
    </div>
  );
}
