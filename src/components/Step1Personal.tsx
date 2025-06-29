import next from "next";
import { useState, ChangeEvent } from "react";

interface PersonalForm {
  name: string;
  email: string;
  enrollmentNumber: string;
  phone: string;
}

interface Props {
  onNext: (data: PersonalForm) => void;
}

export default function Step1Personal({ onNext }: Props) {
  const [form, setForm] = useState<PersonalForm>({
    name: "",
    email: "",
    phone: "",
    enrollmentNumber: "",
  });
  const [Loading, setLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid =
    form.name && form.email && form.phone && form.enrollmentNumber;

  return (
    <div className=" mx-auto bg-white   space-y-6 ">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
        <p className="text-gray-500">
          Please provide your personal information
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enrollment Number [ College / Board ]{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            name="enrollmentNumber"
            type="text"
            placeholder="E1234567890"
            value={form.enrollmentNumber}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <button
        onClick={() => {onNext(form),setLoading(true)}}
        disabled={!isFormValid}
        className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-all
          ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        {/* {Loading? "Saving...":"Continue"} */}
        {Loading ? (
          <span className="flex items-center justify-center gap-2">
            Saving...
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 5.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-2.574z"
              ></path>
            </svg>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Continue{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
