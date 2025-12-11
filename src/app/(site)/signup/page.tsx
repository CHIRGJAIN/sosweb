"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthCard } from "@/components/layout/auth-card";
import { Button } from "@/components/ui/button";
import { mockApi } from "@/utils/mockApi";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  address: "",
  primaryContact: "",
  secondaryContact: "",
  medicalConditions: "",
  allergies: "",
  medications: "",
  aadhar: "",
};

type SignupState = typeof initialState;

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignupState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasEmpty = Object.entries(form).some(([key, value]) => {
      if (key === "secondaryContact") {
        return value.trim() === "";
      }
      return value.trim() === "";
    });

    if (hasEmpty) {
      toast.error("Please complete all fields to sign up.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const response = await mockApi(() => true, { delay: 1800 });
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(response.message ?? "Unable to sign up right now.");
      return;
    }

    toast.success("Sign up successful!");
    router.push("/ops");
  };

  return (
    <AuthCard title="Create Account" description="Register to synchronise with the SANKATMOCHAN crisis command grid.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldInput label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <FieldInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <FieldInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <FieldInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <FieldInput label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          <FieldInput label="Aadhar Card Number" name="aadhar" value={form.aadhar} onChange={handleChange} />
        </div>

        <FieldTextArea label="Address" name="address" value={form.address} onChange={handleChange} />

        <div className="grid gap-4 md:grid-cols-2">
          <FieldInput
            label="Primary Emergency Contact"
            name="primaryContact"
            value={form.primaryContact}
            onChange={handleChange}
          />
          <FieldInput
            label="Secondary Emergency Contact"
            name="secondaryContact"
            value={form.secondaryContact}
            onChange={handleChange}
          />
        </div>

        <FieldTextArea
          label="Medical Conditions"
          name="medicalConditions"
          value={form.medicalConditions}
          onChange={handleChange}
        />
        <FieldTextArea label="Allergies" name="allergies" value={form.allergies} onChange={handleChange} />
        <FieldTextArea
          label="Medications"
          name="medications"
          value={form.medications}
          onChange={handleChange}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </AuthCard>
  );
}

interface FieldInputProps {
  label: string;
  name: keyof SignupState;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function FieldInput({ label, name, value, onChange, type = "text" }: FieldInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-soft px-4 py-3 text-sm"
      />
    </div>
  );
}

interface FieldTextAreaProps {
  label: string;
  name: keyof SignupState;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

function FieldTextArea({ label, name, value, onChange }: FieldTextAreaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full rounded-2xl border border-soft px-4 py-3 text-sm"
      />
    </div>
  );
}
