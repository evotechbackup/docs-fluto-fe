import React, { useState } from "react";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";

interface FAQQueryComponentProps {
  moduleName: string;
  questions: { question: string; answer: string; id: number }[];
}

const FAQQueryComponent = ({
  moduleName,
  questions,
}: FAQQueryComponentProps) => {
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setOpenQuestionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="card border-0">
      <div className="card-body p-4">
        <h2 className="text-dark fw-bold text-start fs-4 mb-3">{moduleName}</h2>

        {questions.map((item) => (
          <div key={item.id} className="mb-3">
            <div
              className="d-flex align-items-start gap-3 py-2 px-2 rounded cursor-pointer"
              onClick={() => toggleQuestion(item.id)}
              style={{ userSelect: "none" }}
            >
              <div className="pt-1">
                {openQuestionId === item.id ? (
                  <FaMinusSquare className="text-secondary fs-6" />
                ) : (
                  <FaPlusSquare className="text-muted fs-6" />
                )}
              </div>
              <h5 className="mb-0 text-dark fw-semibold fs-6 lh-sm">
                {item.question}
              </h5>
            </div>

            {openQuestionId === item.id && (
              <p className="p-2 ms-2 text-gray-700 fw-normal text-muted text-start fs-9 border-start border-2 mt-1">
                {item.answer}
              </p>
            )}

            <hr
              className="mt-3 mb-2"
              style={{
                borderTop: "2px dashed",
                height: "1px",
                margin: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQQueryComponent;
