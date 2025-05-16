import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <section className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg my-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Feedback on the Interview -{" "}
          <span className="capitalize text-indigo-600">{interview.role}</span>
        </h1>
        <p className="mt-2 text-gray-500">Your detailed feedback report</p>
      </header>

      {/* Summary Stats */}
      <div className="flex justify-center gap-10 mb-10 text-gray-700">
        <div className="flex items-center gap-3 bg-indigo-50 rounded-lg px-5 py-3 shadow-sm">
          <Image src="/star.svg" width={24} height={24} alt="star" />
          <div>
            <p className="text-sm font-medium">Overall Impression</p>
            <p className="text-xl font-bold text-indigo-600">
              {feedback?.totalScore ?? "N/A"}/100
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50 rounded-lg px-5 py-3 shadow-sm">
          <Image src="/calendar.svg" width={24} height={24} alt="calendar" />
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-lg text-gray-600">
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="mb-10 border-gray-200" />

      {/* Final Assessment */}
      <article className="mb-12 prose prose-indigo max-w-none">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Final Assessment
        </h2>
        <p className="text-gray-700">{feedback?.finalAssessment || "No final assessment available."}</p>
      </article>

      {/* Interview Breakdown */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Breakdown of the Interview
        </h2>
        <div className="space-y-6">
          {feedback?.categoryScores?.map((category, index) => (
            <div
              key={index}
              className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100"
            >
              <p className="font-bold text-indigo-700 text-lg mb-2">
                {index + 1}. {category.name} ({category.score}/100)
              </p>
              <p className="text-gray-700">{category.comment}</p>
            </div>
          )) || <p className="text-gray-500">No category scores available.</p>}
        </div>
      </section>

      {/* Strengths and Areas for Improvement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div>
          <h3 className="text-xl font-semibold text-green-700 mb-4">Strength</h3>
          {feedback?.strengths?.length ? (
            <ul className="list-disc list-inside text-black space-y-2">
              {feedback.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          ) : (
            <p className="text-black">No strengths listed.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Areas for Improvement
          </h3>
          {feedback?.areasForImprovement?.length ? (
            <ul className="list-disc list-inside space-y-2">
              {feedback.areasForImprovement.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          ) : (
            <p className="text-black">No improvement areas listed.</p>
          )}
        </div>
      </section>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6">
        <Button className="btn-secondary flex-1 border border-indigo-300 hover:bg-indigo-100 transition">
          <Link href="/" className="w-full block text-center">
            <p className="text-indigo-700 font-semibold text-sm">Back to dashboard</p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1 bg-indigo-600 hover:bg-indigo-700 transition">
          <Link href={`/interview/${id}`} className="w-full block text-center">
            <p className="text-white font-semibold text-sm">Retake Interview</p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default page;
