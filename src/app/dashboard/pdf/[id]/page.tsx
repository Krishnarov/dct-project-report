"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
interface Student {
  id: string;
  personalDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  collegeInfo?: {
    collegeName: string;
    course: string;
    branch: string;
    TeacherName: string;
    session: string;
    collegeLogo: {
      url: string;
    };
  };
  projectDetails?: {
    projectName: string;
    description: string;
    projectTitle: string;
    duration: string;
    TrainingType: string;
    frontendTechnology: string;
    backendTechnology: string;
    database: string;
  };
  projectAssets?: {
    erDiagram: {
      url: string;
    };
    dfdDiagram: {
      url: string;
    };
    uiScreenshots: Array<{
      url: string;
    }>;
    projectCode: string[];
  };
}

export default function PDFPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Actual API call would look like:
    fetch(`/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => setStudent(data.student))
      .catch((err) => console.log(err));
  }, [studentId]);

    const handlePrint = () => {
    // Enhanced print-specific styles with proper page breaks
    const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      #pdf-content, #pdf-content * {
        visibility: visible;
      }
      #pdf-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
      }
      
      /* Page break styles */
      .page-break {
        page-break-after: always !important;
        break-after: always !important;
      }
      
      .page-break:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
      
      /* Prevent page breaks inside these elements */
      .no-page-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Ensure proper margins for print */
      @page {
        margin: 10mm;
        size: A4;
      }
      
      /* Fix image and content sizing for print */
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    }
  `;

    // Add styles temporarily
    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    // Trigger print
    window.print();

    // Clean up after printing
    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };

  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  console.log(student);

  const [content, setContent] = useState({
    introduction: "",
    projectGoals: "",
    systemAnalysis: "",
    coreFeatures: "",
    systemArchitecture: "",
    systemDesign: "",
    backendDesign: "",
    dataModeling: "",
    conclusion: "",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(2);
  const [isdisabled, setisdisabled] = useState(true);
console.log(progress);

 const getPromptTemplates = (student) => {
    const {
      projectTitle,
      projectName,
      backendTechnology,
      frontendTechnology,
      database,
    } = student?.projectDetails || {};

    return [
      {
        key: "introduction",
        prompt: `Generate a detailed introduction section for the ${projectTitle} project. Format your response exactly as shown below with clear sections:

**1.1 Project Overview**
Write a single comprehensive paragraph about ${projectName}, its main purpose, core functionality, and what makes it unique. Mention how it uses ${frontendTechnology} for frontend and ${backendTechnology} for backend.

**1.2 Background**
Write a single comprehensive paragraph about the current market need, industry challenges, and why this ${projectTitle} project was chosen. Explain the gap in existing solutions.

**1.3 Objectives & Scope**
Write a single comprehensive paragraph for Objectives & Scope:

**1.4 Target Audience**
Write a single comprehensive paragraph about the target audience:

**1.5 Problem Statement**
Write a single comprehensive paragraph about the problem statement:

Use professional language and ensure each section has substantial content in single paragraph format.`,
      },
      {
        key: "projectGoals",
        prompt: `Generate Project Goals section for ${projectTitle}. Format exactly as below:

**2.1 Purpose & Benefits**
Write a single comprehensive paragraph about the purpose and benefits:

**2.2 Key Deliverables**
Write a single comprehensive paragraph about key deliverables:

You can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "systemAnalysis",
        prompt: `Create comprehensive System Analysis for ${projectTitle}. Format exactly as below:

**3.1 System Objectives**
Write a single comprehensive paragraph about System Objectives:

**3.2 Development Methodology**
Write a single comprehensive paragraph about Development Methodology:
 
You can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "coreFeatures",
        prompt: `List and describe 5 core features for ${projectTitle} built with ${backendTechnology} and ${frontendTechnology}. Format exactly as below:

**4.1 User Authentication & Authorization**
Write a single comprehensive paragraph about this section:

**4.2 Data Management System**
Write a single comprehensive paragraph about this section:

**4.3 User Interface & Experience**
Write a single comprehensive paragraph about this section:

**4.4 Search & Filter Functionality**
Write a single comprehensive paragraph about this section:

**4.5 Admin Dashboard & Controls**
Write a single comprehensive paragraph about this section:

Provide implementation details and user benefits for each feature in ${projectName}, you can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "systemArchitecture",
        prompt: `Describe comprehensive system architecture for ${projectTitle}. Format exactly as below:

**6.1 High-Level Architecture**
Write a single comprehensive paragraph about High-Level Architecture:

**6.2 Key Components**
Write a single comprehensive paragraph about Key Components:

Include technical specifications and explain how components interact in ${projectTitle}, you can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "systemDesign",
        prompt: `Explain comprehensive system design approach for ${projectTitle}. Format exactly as below:

**7.1 Design Methodology**
Write a single comprehensive paragraph about Design Methodology:

**7.2 Design Patterns**
Write a single comprehensive paragraph about Design Patterns:

Focus on specific design decisions made for ${projectTitle} and their technical rationale, you can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "backendDesign",
        prompt: `Detail comprehensive backend design for ${projectTitle} using ${backendTechnology}. Format exactly as below:

**8.1 Data Models**
Write a single comprehensive paragraph about Data Models:

**8.2 API Design**
Write a single comprehensive paragraph about API Design:

**8.3 Business Logic**
Write a single comprehensive paragraph about Business Logic:

Include specific technical implementation details for ${projectTitle}, you can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "dataModeling",
        prompt: `Explain comprehensive data modeling for ${projectTitle} with ${database}. Format exactly as below:

**9.1 Database Schema**
Write a single comprehensive paragraph about Database Schema:

**9.2 Collections/Tables**
Write a single comprehensive paragraph about Collections/Tables:

Provide clear technical rationale for database design decisions in ${projectTitle}, you can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "conclusion",
        prompt: `Write comprehensive conclusion for ${projectTitle} project. Format exactly as below:

**13.1 Project Summary**
Write a single comprehensive paragraph about Project Summary:

**13.2 Future Enhancements**
Write a single comprehensive paragraph about Future Enhancements:

Summarize the overall success of ${projectTitle} and provide a roadmap for future development, you can use project Details name:${projectName}, Title:${projectTitle}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
    ];
  };

  // Optimized content generation with better error handling
  const generateContent = async (section, prompt) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        requestData,
        {
          timeout: 30000, // 30 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, [section]: generatedText }));
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating ${section}:`, error);
      setContent((prev) => ({
        ...prev,
        [section]: `Error generating content for ${section}. Please try again.`,
      }));
      return false;
    }
  };

  // Parallel generation with concurrency control
  const generateAllContent = async () => {
    if (!student?.projectDetails) {
      console.error("Student project details not available");
      return;
    }

    setLoading(true);
    setProgress(0);

    const sections = getPromptTemplates(student);
    const BATCH_SIZE = 3; // Generate 3 sections at a time to avoid rate limits

    try {
      for (let i = 0; i < sections.length; i += BATCH_SIZE) {
        const batch = sections.slice(i, i + BATCH_SIZE);

        // Process batch concurrently
        const promises = batch.map(({ key, prompt }) =>
          generateContent(key, prompt)
        );

        await Promise.all(promises);

        // Update progress
        const completedSections = Math.min(i + BATCH_SIZE, sections.length);
        setProgress((completedSections / sections.length) * 100);

        // Rate limiting between batches
        if (i + BATCH_SIZE < sections.length) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error("Error in batch generation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced useEffect with dependency management
  useEffect(() => {
    if (student?.projectDetails && GEMINI_API_KEY) {
      generateAllContent();
    } else {
      console.warn("Missing required data:", {
        hasStudent: !!student?.projectDetails,
        hasApiKey: !!GEMINI_API_KEY,
      });
    }
  }, [student?.projectDetails?.projectTitle]); // Only re-run if project title changes

  // Optional: Add retry mechanism
  const retryFailedSections = async () => {
    const failedSections = Object.entries(content)
      .filter(([key, value]) => value.includes("Error generating"))
      .map(([key]) => key);

    if (failedSections.length === 0) return;

    const sections = getPromptTemplates(student);
    const retryPromises = failedSections.map((sectionKey) => {
      const section = sections.find((s) => s.key === sectionKey);
      return section
        ? generateContent(section.key, section.prompt)
        : Promise.resolve(false);
    });

    await Promise.all(retryPromises);
  };

  const handleDownload = async () => {
    const content = pdfRef.current;
    if (!content) {
      alert("Content not found for PDF generation");
      return;
    }

    try {
      // Dynamically import html2pdf.js to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;

      // Clone the content to avoid modifying the original
      const clonedContent = content.cloneNode(true);

      // Remove any elements that shouldn't be in PDF
      const buttonsToRemove = clonedContent.querySelectorAll("button");
      buttonsToRemove.forEach((button) => button.remove());

      const opt = {
        margin: [10, 10, 10, 10], // top, right, bottom, left
        filename: `${
          student?.personalDetails?.name || "report"
        }_project_report.pdf`,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          height: window.innerHeight,
          width: window.innerWidth,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      };

      // Generate and save PDF
      await html2pdf().set(opt).from(clonedContent).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Failed to generate PDF. Please try again or check your internet connection."
      );
    }
  };

useEffect(() => {
  if (progress === 100) {
    setisdisabled(false);
  }
}, [progress]);


  if (!student) return <div className="p-5">Loading...</div>;

  console.log(content);

  return (
    <div className="p-5 space-y-4 ">
      <span className={`  h-1 shadow-indigo-400 shadow bg-indigo-500 absolute top-0 left-0`}   style={{ width: `${progress}%` }}></span>
      <div className="flex justify-center">
        <div className="space-x-2 mb-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handlePrint}
             disabled={isdisabled}
            className={`bg-blue-500 text-white px-4 py-2 rounded  ${isdisabled ? 'bg-gray-400 cursor-not-allowed' : 'primary'}`}
          >
            Print
          </button>
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
          <button
            onClick={retryFailedSections}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            retryFailedSections{" "}
          </button>
        </div>
      </div>

      {/* PDF Content - A4 size */}
      <div
        ref={pdfRef}
        id="pdf-content"
        className="   bg-white text-black w-[210mm]  mx-auto shadow-lg"
        style={{
          fontFamily: "'Times New Roman', serif",
          fontSize: "12pt",
          lineHeight: "1.5",
        }}
      >
        {/* Page 1 */}
        <div className=" page-break flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold mb-8 mt-10">
            {student.projectDetails?.projectName}
          </h1>
          <h2 className="text-2xl mb-8">Project Report</h2>

          <p className="mb-8">
            Submitted in Partial fulfillment for the award of
            <br />
            {student.collegeInfo.course === "MCA" &&
              "Master of Computer Applications"}
            {student.collegeInfo.course === "BCA" &&
              "Bachelor of Computer Applications"}
            {student.collegeInfo.course !== "MCA" &&
              student.collegeInfo.course !== "BCA" && (
                <>{student.collegeInfo.course} in </>
              )}
            {student.collegeInfo.branch}
          </p>

          <p className="font-bold mb-8 text-xl">
            DIGICODERS TECHNOLOGIES PVT. LTD. <br />
            LUCKNOW(UP)
          </p>
          {/* <div className="w-full"> */}
          <div className="flex justify-evenly w-full ">
            <div>
              <Image
                src="/img/digicoders_logo.jpg"
                alt="Logo"
                width={150}
                height={100}
              />
            </div>

            {student.collegeInfo.collegeLogo.url && (
              <div>
                <img
                  src={student.collegeInfo.collegeLogo.url}
                  alt="Logo"
                  width={150}
                  height={100}
                />
              </div>
            )}
          </div>
          {/* </div> */}
          <div className="flex w-full justify-evenly mt-8">
            <div className="mb-8 p-4 border-2 border-sky-400 w-64">
              <p className="font-bold">Assist by</p>
              <p>Er. Himanshu Kashyap</p>
              <p>Project Manager-DigiCoders</p>
            </div>
            <div className="mb-8 p-4 border-2 border-sky-400 w-64">
              <p className="font-bold">Submitted to</p>
              <p>Er. {student.collegeInfo.TeacherName}</p>
              <p>College Hod </p>
            </div>
          </div>

          <p className="mb-8">Session - {student.collegeInfo.session}</p>

          <p className="font-bold text-2xl px-20">
            {student.collegeInfo?.collegeName}
          </p>
          <div className="flex justify-between w-lg">
            <div className="mt-10">
              <p className="font-bold">Submitted by:</p>
              <p>{student.personalDetails?.name}</p>
            </div>
            <div className="mt-10">
              <p className="font-bold">Submitted to:</p>
              <p>{student.collegeInfo.TeacherName}</p>
            </div>
          </div>
        </div>

        {/* Page 2 */}
        <div
          className="page-break  flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">
            CERTIFICATE{" "}
          </h1>

          <p className="mb-4 text-justify">
            This is to certify that the project work titled "
            <strong>{student.projectDetails.projectTitle}</strong>" has been
            successfully completed by{" "}
            <strong>{student.personalDetails?.name}</strong> under my
            supervision and guidance
          </p>
          <p className="mb-4 text-justify">
            This project is a bonafide piece of work carried out by the student
            during the academic year {student.collegeInfo.session} as part of
            the{" "}
            <strong>
              {" "}
              {student.projectDetails.duration}{" "}
              {student.projectDetails.TrainingType}{" "}
            </strong>{" "}
            program at <strong> DigiCoders Technologies Pvt Ltd.</strong>
          </p>
          <p className="mb-4 text-justify">
            The project work demonstrates a comprehensive understanding of web
            development technologies and represents original work in the field
            of job portal development. The student has shown dedication,
            technical competence, and professional approach throughout the
            project duration.
          </p>
          <p className="mb-4 text-justify">
            This project is submitted in partial fulfillment of the requirements
            for the{" "}
            <strong>
              {student.collegeInfo.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo.course !== "MCA" &&
                student.collegeInfo.course !== "BCA" && (
                  <>{student.collegeInfo.course} in </>
                )}
              {student.collegeInfo.branch}
            </strong>{" "}
            from <strong>{student.collegeInfo?.collegeName}.</strong>
            {/* Diploma in Computer Science & Engineering from Mahamaya
            Polytechnic of Information Technology, Kushinagar. */}
          </p>

          <p className=" text-justify">
            I recommend this project work for evaluation and acceptance.
          </p>

          <p className="mt-10 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2  flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>

          <p className="mt-5 ">
            <strong>Institution:</strong> {student.collegeInfo?.collegeName}
          </p>
          <p className="mt-2 ">
            <strong>Department:</strong>{" "}
            {student.collegeInfo.course === "MCA" &&
              "Master of Computer Applications"}
            {student.collegeInfo.course === "BCA" &&
              "Bachelor of Computer Applications"}
            {student.collegeInfo.course === "MCA" && "BCA"
              ? ""
              : student.collegeInfo.branch}
          </p>
          <p className="mt-2 ">
            <strong>Academic Year:</strong> {student.collegeInfo.session}
          </p>
        </div>

        {/* Page 3 */}
        <div
          className="page-break    flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">
            CERTIFICATE OF APPROVAL
          </h1>

          <p className="mb-4 text-justify">
            This is to certify that the project titled “
            <strong>{student.projectDetails.projectTitle}</strong>” has been
            successfully completed by{" "}
            <strong>{student.personalDetails?.name}</strong>, under the
            technical guidance and project development support of{" "}
            <strong> DigiCoders Technologies Pvt Ltd.</strong>
            Pvt. Ltd..
          </p>
          <p className="mb-4 text-justify">
            The project work has been reviewed and evaluated by the technical
            team at Digicoders and is hereby approved as a valid and original
            project carried out in the field of Computer Science & Engineering.
            The project meets the academic and technical standards required for
            submission towards the fulfillment of the{" "}
            {student.collegeInfo.course === "MCA" &&
              "Master of Computer Applications"}
            {student.collegeInfo.course === "BCA" &&
              "Bachelor of Computer Applications"}
            {student.collegeInfo.course === "MCA" && "BCA"
              ? ""
              : student.collegeInfo.branch}
            .
          </p>
          <p className="mb-4 text-justify">
            This approval acknowledges that the project has been prepared with
            proper effort, guidance, and technical support. However, it does not
            imply that Digicoders Technologies Pvt. Ltd. endorses or agrees with
            every opinion, conclusion, or interpretation expressed in the
            project report. The project is accepted solely for academic
            evaluation purposes.
          </p>
          <p className="mb-4 text-justify">
            We commend <strong>{student.personalDetails?.name}</strong> for the
            dedication and sincerity shown during the project development
            process.
          </p>

          <p className="mt-10 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2 mb-10 flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>

          <div className="flex justify-between mt-14">
            <div>
              <div>________________________</div>
              <p className="font-bold">(INTERNAL EXAMINER)</p>
            </div>

            <div>
              <div>________________________</div>
              <p className="font-bold">(EXTERNAL EXAMINER)</p>
            </div>
          </div>
        </div>

        {/* Page 4 */}
        <div
          className="page-break    flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">DECLARATION</h1>

          <p className="mb-4 text-justify">
            I hereby declare that the work presented in this Minor Project
            titled “<strong>{student.projectDetails.projectTitle}</strong>” is
            the result of my own effort and is an original contribution to the
            field of{" "}
            <strong>
              {student.collegeInfo.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo.course === "MCA" && "BCA"
                ? ""
                : student.collegeInfo.branch}
              .
            </strong>
          </p>
          <p className="mb-4 text-justify">
            This project has been carried out as a part of the academic
            requirements for the{" "}
            <strong>
              {" "}
              {student.collegeInfo.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo.course === "BCA" &&
                "Bachelor of Computer Applications"}{" "}
              {student.collegeInfo.course === "MCA" && "BCA"
                ? ""
                : `${student.collegeInfo.course} in ${student.collegeInfo.branch}`}{" "}
            </strong>{" "}
            at <strong>{student.collegeInfo?.collegeName}.</strong> To the best
            of my knowledge, the content of this project is authentic, accurate,
            and has been completed in accordance with engineering ethics and
            academic standards.
          </p>
          <p className="mb-4 text-justify">
            I further declare that this project work does not contain any
            material that has been previously submitted to any other university
            or institution for the award of any degree or diploma. Additionally,
            this project does not infringe upon any existing patents,
            copyrights, or intellectual property rights.
          </p>

          <p className="mt-20 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4  flex gap-2">
            <strong> Student Name:</strong> {student.personalDetails?.name}
          </p>
          <p className="mt-2 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2 mb-10 flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>
        </div>

        {/* Page 5 */}
        <div
          className="page-break    flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">
            {" "}
            ACKNOWLEDGEMENT
          </h1>

          <p className="mb-4 text-justify">
            The successful completion of this project would not have been
            possible without the support, guidance, and encouragement of several
            individuals and organizations. I would like to express my sincere
            gratitude to all those who contributed to this project.
          </p>

          <p className="mb-4 text-justify">
            First and foremost, I am extremely thankful to{" "}
            <strong> Digicoders Technologies Pvt. Ltd.</strong>, for providing
            me with the opportunity to work on this project. Their valuable
            resources, technical expertise, and continuous support throughout
            the development process played a crucial role in the successful
            completion of this work.
          </p>

          <p className="mb-4 text-justify">
            I extend my heartfelt gratitude to{" "}
            <strong> {student.collegeInfo.TeacherName}</strong>, Head of the
            Department of{" "}
            <strong>
              {student.collegeInfo.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo.course === "MCA" && "BCA"
                ? ""
                : student.collegeInfo.branch}
              , {student.collegeInfo?.collegeName},{" "}
            </strong>
            for his constant guidance, motivation, and valuable suggestions at
            every stage of this project.
          </p>

          <p className="mb-4 text-justify">
            I am also grateful to all the faculty members and staff of the
            <strong> Digicoders Technologies Pvt. Ltd.</strong> for their
            support, cooperation, and encouragement during the project
            development.
          </p>
          <p className="mb-4 text-justify">
            A special thanks to <strong>Er. Himanshu Kashyap,</strong> for his
            consistent mentorship, motivation, and insightful feedback, which
            helped me overcome challenges and guided me in the right direction.
          </p>


          <p className="mt-10 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4  flex gap-2">
            <strong> Student Name:</strong> {student.personalDetails?.name}
          </p>
          <p className="mt-2 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2 mb-10 flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>
        </div>

        {/* Page 6 - Index */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">INDEX</h1>

          <div className="space-y-2">
            <h2 className="font-bold">1. Introduction</h2>
            <ul className="ml-8 list-disc">
              <li>1.1 Overview of the Hotel Management System</li>
              <li>1.2 Background of the Project</li>
              <li>1.3 Objectives and Scope</li>
              <li>1.4 Intended Audience</li>
              <li>1.5 Problem Definition</li>
            </ul>

            <h2 className="font-bold mt-4">2. Project Goals</h2>
            <ul className="ml-8 list-disc">
              <li>2.1 Purpose and Benefits</li>
              <li>2.2 Key Deliverables</li>
            </ul>

            <h2 className="font-bold mt-4">3. System Analysis</h2>
            <ul className="ml-8 list-disc">
              <li>3.1 Objectives</li>
              <li>3.2 Agile Development Model Process</li>
              <ul className="ml-8 list-disc">
                <li>3.2.1 Project Inception and Planning</li>
                <li>3.2.2 Requirements Gathering and Analysis</li>
                <li>3.2.3 Iterative Development</li>
                <li>3.2.4 Design and Prototyping</li>
                <li>3.2.5 Development and Integration</li>
                <li>3.2.6 Testing and Quality Assurance</li>
                <li>3.2.7 Deployment and Release</li>
                <li>3.2.8 Maintenance and Iteration</li>
              </ul>
              <li>3.3 ER Diagram</li>
              <li>3.4 Data Flow Diagram</li>
            </ul>

            <h2 className="font-bold mt-4">4. Core Features</h2>
            <ul className="ml-8 list-disc">
              <li>4.1 Voter Registration and Authentication</li>
              <li>4.2 Candidate Management</li>
              <li>4.3 Voting Process and Ballot Casting</li>
              <li>4.4 Real-time Vote Counting and Results Display</li>
              <li>4.5 Security and Fraud Prevention</li>
            </ul>

            <h2 className="font-bold mt-4">5. Technology Stack</h2>
            <ul className="ml-8 list-disc">
              <li>5.1 Frontend Technologies</li>
              <li>5.2 Backend Technologies</li>
              <li>5.3 Database Solutions</li>
            </ul>

            <h2 className="font-bold mt-4">6. System Architecture</h2>
            <ul className="ml-8 list-disc">
              <li>6.1 High-Level Architecture Overview</li>
              <li>6.2 Key System Components</li>
            </ul>

            <h2 className="font-bold">7. System Design Methodology</h2>
            <ul className="ml-8 list-disc">
              <li>7.1 Top-Down Design</li>
              <li>7.2 Bottom-Up Design</li>
              <li>7.3 Modular Design Approach</li>
            </ul>

            <h2 className="font-bold mt-4">8. Backend Design</h2>
            <ul className="ml-8 list-disc">
              <li>8.1 Description of Classes and Models </li>
              <li>8.2 Defined URLs</li>
            </ul>

            <h2 className="font-bold mt-4">9. Data Modeling</h2>
            <ul className="ml-8 list-disc">
              <li>9.1 Database Schema Overview</li>
              <li>9.2 List of Tables</li>
            </ul>

            <h2 className="font-bold mt-4">10. Development Plan</h2>
            <ul className="ml-8 list-disc">
              <li>10.1 Phases of Development</li>
              <li>10.2 Timeline and Milestones</li>
            </ul>

            <h2 className="font-bold mt-4">
              11. Testing and Quality Assurance
            </h2>
            <ul className="ml-8 list-disc">
              <li>11.1 Testing Strategies</li>
              <li>11.2 Testing Methodologies</li>
              <li>11.3 User Acceptance Testing</li>
            </ul>

            <h2 className="font-bold mt-4">
              12. User Experience and Interface
            </h2>
            <ul className="ml-8 list-disc">
              <li>12.1 Design Principles</li>
              <li>12.2 User Interface Screenshots</li>
            </ul>
            <h2 className="font-bold mt-4">13. Conclusion</h2>
            <ul className="ml-8 list-disc">
              <li>13.1 Summary of Project Achievements</li>
              <li>13.2 Future Work and Enhancements</li>
            </ul>
          </div>
        </div>
        {/* Page 8 - 1. Introduction */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            1. Introduction
          </h1>
          <div className="space-y-2">
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[1]}
            </h2>
            <p>{content?.introduction.split("**")[2]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[3]}
            </h2>
            <p>{content?.introduction.split("**")[4]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[5]}
            </h2>
            <p>{content?.introduction.split("**")[6]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[7]}
            </h2>
            <p>{content?.introduction.split("**")[8]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[9]}
            </h2>
            <p>{content?.introduction.split("**")[10]}</p>
          </div>
        </div>
        {/* Page 9 - 2. Project Goals */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            2. Project Goals
          </h1>
          <div className="space-y-2">
            {content?.projectGoals ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.projectGoals.split("**")[1]}
                </h2>
                <p>{content?.projectGoals.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.projectGoals.split("**")[3]}
                </h2>
                <p>{content?.projectGoals.split("**")[4]}</p>
              </>
            ) : (
              <p>Loading Project Goals content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 3. System Analysis */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            3. System Analysis
          </h1>
          <div className="space-y-2">
            {content?.systemAnalysis ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.systemAnalysis.split("**")[1]}
                </h2>
                <p>{content?.systemAnalysis.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemAnalysis.split("**")[3]}
                </h2>
                <p>{content?.systemAnalysis.split("**")[4]}</p>
              </>
            ) : (
              <p>Loading Project Goals content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 3. System Analysis */}
        <div className="page-break flex   flex-col p-8">
          <div className="space-y-2">
            <h2 className="texl-sm font-black">3.3 ER Diagram</h2>
            <div className="flex justify-center">
              <img
                src={student.projectAssets.erDiagram.url?student.projectAssets.erDiagram.url:"/img/erdigram.png"}
                alt=""
                width={500}
              />
            </div>
            <h2 className="texl-sm font-black">3.4 Data Flow Diagram</h2>
            <div className="flex justify-center">
              <img
                src={student.projectAssets.dfdDiagram.url?student.projectAssets.dfdDiagram.url:"/img/dfddigram.png"}
                alt=""
                width={500}
              />
            </div>
          </div>
        </div>
        {/* Page 9 - 4. Core Features */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            4. Core Features
          </h1>
          <div className="space-y-2">
            {content?.coreFeatures ? (
              <>
                
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[1]}
                </h2>
                <p>{content?.coreFeatures.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[3]}
                </h2>
                <p>{content?.coreFeatures.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[5]}
                </h2>
                <p>{content?.coreFeatures.split("**")[6]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[7]}
                </h2>
                <p>{content?.coreFeatures.split("**")[8]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[9]}
                </h2>
                <p>{content?.coreFeatures.split("**")[10]}</p>
               
              </>
            ) : (
              <p>Loading Project Goals content...</p>
            )}

          </div>
        </div>
        {/* Page 9 - 5. Technology Stack */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            5. Technology Stack
          </h1>
          <div className="space-y-2">
            <h2 className="texl-sm font-black mt-5">
              5.1 Frontend Technologies
            </h2>
            <li>{student.projectDetails.frontendTechnology}</li>
            <h2 className="texl-sm font-black mt-5">
              5.2 Backend Technologies
            </h2>
            <li>{student.projectDetails.backendTechnology}</li>
            <h2 className="texl-sm font-black mt-5">5.3 Database Solutions</h2>
            <li>{student.projectDetails.database}</li>
          </div>
        {/* </div> */}
        {/* Page 9 - 6. System Architecture */}
        {/* <div className="page-break flex   flex-col p-8"> */}
          <h1 className="text-2xl font-bold mb-6 text-center mt-10">
            6. System Architecture
          </h1>
          <div className="space-y-2">
            {content?.systemArchitecture ? (
              <>
                
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[1]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[3]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[5]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[6]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[7]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[8]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[9]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[10]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[11]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[12]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[13]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[14]}</p>

               
              </>
            ) : (
              <p>Loading Project Goals content...</p>
            )}

            </div>
        </div>
        {/* Page 9 - 7. System Design Methodology */}
        <div className=" page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            7. System Design Methodology
          </h1>
          <div className="space-y-2">
             {content?.systemDesign ? (
              <>
                
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[1]}
                </h2>
                <p>{content?.systemDesign?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[3]}
                </h2>
                <p>{content?.systemDesign?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[5]}
                </h2>
                <p>{content?.systemDesign?.split("**")[6]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[7]}
                </h2>
                <p>{content?.systemDesign?.split("**")[8]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[9]}
                </h2>
                <p>{content?.systemDesign?.split("**")[10]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[11]}
                </h2>
                <p>{content?.systemDesign?.split("**")[12]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[13]}
                </h2>
                <p>{content?.systemDesign?.split("**")[14]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[15]}
                </h2>
                <p>{content?.systemDesign?.split("**")[16]}</p>
                
               
              </>
            ) : (
              <p>Loading system Design content...</p>
            )}
            </div>
        </div>
        {/* Page 9 - 8. Backend Design */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            8. Backend Design
          </h1>
          <div className="space-y-2">
             {content?.backendDesign ? (
              <>
                
                <h2 className="font-bold mt-4">
                  {content?.backendDesign?.split("**")[1]}
                </h2>
                <p>{content?.backendDesign?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.backendDesign?.split("**")[3]}
                </h2>
                <p>{content?.backendDesign?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.backendDesign?.split("**")[5]}
                </h2>
                <p>{content?.backendDesign?.split("**")[6]}</p>               
              </>
            ) : (
              <p>Loading system Design content...</p>
            )}

            </div>
        </div>
        {/* Page 9 - 9. Data Modeling */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            9. Data Modeling
          </h1>
          <div className="space-y-2">
             {content?.dataModeling ? (
              <>
                
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[1]}
                </h2>
                <p>{content?.dataModeling?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[3]}
                </h2>
                <p>{content?.dataModeling?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[5]}
                </h2>
                <p>{content?.dataModeling?.split("**")[6]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[7]}
                </h2>
                <p>{content?.dataModeling?.split("**")[8]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[9]}
                </h2>
                <p>{content?.dataModeling?.split("**")[10]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[11]}
                </h2>
                <p>{content?.dataModeling?.split("**")[12]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[13]}
                </h2>
                <p>{content?.dataModeling?.split("**")[14]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[15]}
                </h2>
                <p>{content?.dataModeling?.split("**")[16]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[17]}
                </h2>
                <p>{content?.dataModeling?.split("**")[18]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[19]}
                </h2>
                <p>{content?.dataModeling?.split("**")[20]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[21]}
                </h2>
                <p>{content?.dataModeling?.split("**")[22]}</p>               
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[23]}
                </h2>
                <p>{content?.dataModeling?.split("**")[24]}</p>               
                             
              </>
            ) : (
              <p>Loading system Design content...</p>
            )}

            </div>
        </div>
        {/* Page 9 - 10. Development Plan */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            10. Development Plan
          </h1>
          <div className="space-y-2">
            <h2 className=" font-black mt-5">10.1 Phases of Development</h2>
            <ol className="list-decimal list-inside ml-4 mt-2">
              <li>Requirements</li>
              <li>UI/UX Design</li>
              <li>Backend Logic</li>
              <li>PDF Export</li>
              <li>Testing</li>
              <li>Deployment</li>
            </ol>

            <h2 className=" font-black mt-5">10.2 Timeline and Milestones</h2>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Week 1-2: Planning & Design</li>
              <li>Week 3-4: Backend Implementation</li>
              <li>Week 5: PDF Integration</li>
              <li>Week 6: Testing & Debugging</li>
              <li>Week 7: Final Deployment</li>
            </ul>
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center  mt-20">
            11. Testing and Quality Assurance
          </h1>
          <div className="space-y-2">
            <h2 className=" font-black mt-5">11.1 Testing Strategies</h2>
            <p>Manual Testing, Unit Tests for critical components.</p>
            <h2 className=" font-black mt-5">11.2 Testing Methodologies</h2>
            <p>Black-box and White-box testing.</p>
            <h2 className=" font-black mt-5">11.3 User Acceptance Testing</h2>
            <p>Final test conducted by a sample group of users.</p>
          </div>
        </div>
        {/* Page 9 - 12. User Experience and Interface */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            12. User Experience and Interface
          </h1>
          <div className="space-y-2">
            <h2 className=" font-black mt-5">12.1 Design Principles</h2>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>User-friendly,</li>
              <li>Mobile Responsive Design</li>
              <li>Clean interface using Bootstrap</li>
              <li>Intuitive navigation</li>
              <li>Consistent design language</li>
            </ul>
            <h2 className=" font-black mt-5">
              12.2 User Interface Screenshots
            </h2>
            <pre className="text-xs overflow-x-hidden">
              {student.projectAssets.projectCode[0]}
              {student.projectAssets.projectCode[1]}
              {student.projectAssets.projectCode[2]}
              {student.projectAssets.projectCode[3]}
              {student.projectAssets.projectCode[4]}
            </pre>

            <div>
              {student.projectAssets.uiScreenshots
                ? student.projectAssets.uiScreenshots.map((ui, index) => (
                    <div key={index}>
                      <img src={ui.url} alt="" />
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
        {/* Page 9 - 13. Conclusion */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            13. Conclusion
          </h1>
          <div className="space-y-2">
            {content?.conclusion ? (
              <>
                
                <h2 className="font-bold mt-4">
                  {content?.conclusion?.split("**")[1]}
                </h2>
                <p>{content?.conclusion?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.conclusion?.split("**")[3]}
                </h2>
                <p>{content?.conclusion?.split("**")[4]}</p>
           
              </>
            ) : (
              <p>Loading system Design content...</p>
            )}
</div>
        </div>
      </div>
    </div>
  );
}
