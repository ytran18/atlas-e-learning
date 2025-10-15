"use client";

import { LearnProvider } from "@/contexts/LearnContext";
import { learnDetail } from "@/mock/learn-detail";

import LearnExam from "../_components/learn/LearnExam";
import LearnPractice from "../_components/learn/LearnPractice";
import LearnSidebar from "../_components/learn/LearnSidebar";
import LearnSteps from "../_components/learn/LearnSteps";
import LearnTheory from "../_components/learn/LearnTheory";

const LearnPage = () => {
    return (
        <div className="h-[calc(100vh-70px)]">
            <div className="h-full">
                {/* <LearnHeader /> */}

                <LearnProvider learnDetail={learnDetail}>
                    <div className="flex gap-x-8 h-full">
                        <LearnSidebar />

                        <LearnSteps
                            slots={{
                                Theory: () => <LearnTheory />,
                                Practice: () => <LearnPractice />,
                                Exam: () => <LearnExam />,
                            }}
                        />
                    </div>
                </LearnProvider>
            </div>
        </div>
    );
};

export default LearnPage;
