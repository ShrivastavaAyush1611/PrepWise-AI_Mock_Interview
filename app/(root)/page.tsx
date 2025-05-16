import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/interviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="max-w-xl flex flex-col gap-6 p-6 from-[#1e293b] to-[#0f172a] rounded-xl shadow-lg text-white">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Get Interview-Ready with{" "}
            <span className="text-indigo-400">AI-Powered</span> Practice &
            Feedback
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            Simulate real interviews, sharpen your responses, and receive
            instant, AI-generated feedback to level up your career.
          </p>

          <Button
            asChild
            className="btn-primary bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 text-lg rounded-md transition-all duration-300 max-sm:w-full"
          >
            <Link href="/interview">🚀 Prepare Your Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/*Your Interviews  */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      {/* Other Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no new interviews yet available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
