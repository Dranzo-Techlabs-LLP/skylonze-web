"use client";
import Link from "next/link";
import { Button } from "./Button";
import { SkyCoin } from "./SkyCoin";
import { useAuth } from "./AuthProvider";

export function CtaButtons() {
  const { user } = useAuth();
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {user && user.bonus_granted ? (
        <>
          <Link href="/dashboard"><Button size="lg"><SkyCoin size={20} /> Open dashboard</Button></Link>
          <Link href="/markets"><Button variant="secondary" size="lg">Browse markets</Button></Link>
        </>
      ) : user ? (
        <>
          <Link href="/settings"><Button size="lg"><SkyCoin size={20} /> Verify email</Button></Link>
          <Link href="/markets"><Button variant="secondary" size="lg">Browse markets</Button></Link>
        </>
      ) : (
        <>
          <Link href="/signup"><Button size="lg"><SkyCoin size={20} /> Claim starter SKY</Button></Link>
          <Link href="/markets"><Button variant="secondary" size="lg">Browse markets</Button></Link>
        </>
      )}
    </div>
  );
}
