"use client";
import { Loader } from "@/components/ui/loader";
import { ResponsiveModal } from "@/modules/shared/components";
import { useState } from "react";

export default function ManageMembers({ email }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      title="Are you sure?"
      description={`You are about to kick ${email} from the ${activeOrganization?.name}.`}
      content=""
      confirmText={
        <>
          {loading && <Loader />}
          Continue
        </>
      }
      cancelText="Cancel"
      onConfirm={handleKickMember}
      confirmDisabled={loading}
      cancelDisabled={loading}
    >
      {children}
    </ResponsiveModal>
  );
}
