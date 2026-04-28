"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from "@/components/ui/field";
import { useTRPC } from "@/trpc/client";
import { Pencil, X } from "lucide-react";

export default function TeamForm({
  organization,
  role,
}: {
  organization: any;
  role?: string;
}) {
  const initialName = organization?.name ?? "";
  const initialDescription = organization?.metadata?.description ?? "";
  const initialSlug = organization?.slug ?? "";
  const initialLogo = organization?.logo ?? "";

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [slug, setSlug] = useState(initialSlug);
  const [logo, setLogo] = useState(initialLogo);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const hasChanges =
    name !== initialName ||
    description !== initialDescription ||
    slug !== initialSlug ||
    logo !== initialLogo;

  const { mutate: updateOrganization } = useMutation(
    trpc.teams.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.teams.get_active_team.queryOptions(),
        );
        toast.success("Team updated");
        setLoading(false);
        setIsEditing(false);
      },
      onError: (error) => {
        if (error.message.includes(" ORGANIZATION_SLUG_ALREADY_EXISTS")) {
          setSlugError("This slug is already in use");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
      },
    }),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlugError(null);
    setLoading(true);

    try {
      await authClient.organization.update({
        organizationId: organization?.id,
        data: {
          name,
          slug,
          logo,
        },
      });

      updateOrganization({
        teamId: organization?.id,
        description,
      });
    } catch (err: any) {
      if (err?.message?.includes(" ORGANIZATION_SLUG_ALREADY_EXISTS")) {
        setSlugError("This slug is already in use");
      } else {
        toast.error(err?.message || "Failed to update team");
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(initialName);
    setDescription(initialDescription);
    setSlug(initialSlug);
    setLogo(initialLogo);
    setSlugError(null);
    setIsEditing(false);
  };

  const canEdit = role === "owner" || role === "admin";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldSet>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <FieldContent>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team name"
                disabled={!isEditing || loading}
                required
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Slug</FieldLabel>
            <FieldContent>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="team-slug"
                disabled={!isEditing || loading}
                required
              />
              {slugError && <FieldError>{slugError}</FieldError>}
              <FieldDescription className="text-xs">
                Unique identifier for your team (used in URLs)
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Logo URL</FieldLabel>
            <FieldContent>
              <Input
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                disabled={!isEditing || loading}
              />
              <FieldDescription className="text-xs">
                Link to your team logo image
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field className="hidden">
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your team"
                disabled={!isEditing || loading}
              />
            </FieldContent>
          </Field>
        </div>
      </FieldSet>

      {isEditing && (
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !hasChanges}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
            <X className="size-4" />
          </Button>
        </div>
      )}
      {!isEditing && canEdit && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          Edit
          <Pencil className="size-3" />
        </Button>
      )}
    </form>
  );
}
