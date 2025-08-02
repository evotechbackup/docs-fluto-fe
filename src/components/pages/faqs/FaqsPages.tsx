import React from "react";
import FAQQueryComponent from "./FAQQueryComponent";
import { faqs } from "../../../helper/constants";

const FaqsPages = () => {
  console.log("faqs", faqs);
  return (
    <div className="">
      {/*begin::Body*/}
      <div className=" mt-5 p-10 p-lg-15">
        {/*begin::Classic content*/}
        <div className="mb-13">
          {/*begin::Intro*/}
          <div className="mb-15">
            {/*begin::Title*/}
            <h4 className="fs-2 text-gray-800 fw-bolder mb-6">
              Frequently Asked Questions
            </h4>
          </div>
          {/*end::Intro*/}

          {/*begin::Row*/}
          <div className="row">
            {faqs.map((item, index) => (
              <div key={index} className="col-8 mb-2">
                <FAQQueryComponent
                  moduleName={item.module}
                  questions={item.questions}
                />
              </div>
            ))}
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Classic content*/}
      </div>
      {/*end::Body*/}
    </div>
  );
};

export default FaqsPages;
