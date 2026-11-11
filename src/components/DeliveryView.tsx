import React from 'react';
import { Truck, MapPin, CheckCircle2, Clock, Phone, FileCheck, ShieldCheck } from 'lucide-react';
import { DeliveryRecord } from '../types';

interface DeliveryViewProps {
  deliveries: DeliveryRecord[];
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({ deliveries }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Delivery & Trucking Logistics
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Dispatch coordination, trucking companies, driver assignment, real-time GPS tracking & Proof of Delivery.
          </p>
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {deliveries.map((dlv) => (
          <div
            key={dlv.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-orange-600">{dlv.deliveryNumber}</span>
                <span className="ml-2 text-xs font-semibold text-slate-500">• {dlv.rentalNumber}</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  dlv.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                {dlv.status}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{dlv.customerName}</h4>
              <p className="text-slate-500 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span>{dlv.siteAddress}</span>
              </p>
            </div>

            {/* Truck & Driver Info */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/40">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Trucking Company</span>
                <p className="font-bold text-slate-900 dark:text-white">{dlv.truckingCompany}</p>
                <p className="text-[10px] text-slate-500 font-mono">Plate: {dlv.truckPlate}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Driver</span>
                <p className="font-bold text-slate-900 dark:text-white">{dlv.driverName}</p>
                <p className="text-[10px] text-slate-500">{dlv.driverPhone}</p>
              </div>
            </div>

            {/* Simulated Live GPS Location Status */}
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-3 text-white text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-400 uppercase">GPS Fleet Telematics</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Signal
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                ETA / Arrival: {dlv.actualArrival || dlv.estimatedArrival}
              </p>
            </div>

            {/* Proof of Delivery if available */}
            {dlv.proofOfDeliveryPhotoUrl && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1">
                    <FileCheck className="h-4 w-4" />
                    Proof of Delivery Confirmed
                  </span>
                  <span>Sig: {dlv.customerSignature}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
