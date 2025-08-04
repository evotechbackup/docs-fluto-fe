import { useState } from "react";
import { DocumentContent } from "../../../helper/DocumentsJSONData";
import { faqs } from "../../../helper/constants";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchDocFaqs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredFaqs: any = faqs
        .flatMap((faq) =>
          faq.questions.filter((q) =>
            q.question.toLowerCase().includes(value.toLowerCase())
          )
        )
        .slice(0, 5);
      setSuggestions(filteredFaqs);

      const searchVal = value.toLowerCase();
      const filteredDocsGrouped: any = DocumentContent.flatMap((doc: any) => {
        const matchedSections = doc.sections?.filter((section: any) => {
          return (
            section.title?.toLowerCase().includes(searchVal) ||
            section?.items?.some((item: any) =>
              item.toLowerCase().includes(searchVal)
            )
          );
        });

        if (!matchedSections?.length) return [];

        return [
          {
            id: doc.id,
            module: doc.title,
            sections: matchedSections.map((section: any) => ({
              sectionTitle: section.title,
            })),
          },
        ];
      }).slice(0, 5);
      setSuggestions2(filteredDocsGrouped);
    } else {
      setSuggestions([]);
      setSuggestions2([]);
    }
  };

  const handleSuggestionClick = (id: any) => {
    setSearchTerm("");
    setSuggestions([]);
    setSuggestions2([]);
    navigate("/faqs");
    const moduleName = faqs.find((faq) =>
      faq.questions.some((q) => q?.id === id)
    )?.module;
    // const elementId = `${moduleName}`;
    navigate(`/faqs?st=${moduleName}`);
  };

  const handleSuggestion2Click = (
    docId: string,
    sectionTitle: string,
    moduleTitle: string
  ) => {
    setSearchTerm("");
    setSuggestions([]);
    setSuggestions2([]);

    const formattedModule = docId?.toLowerCase().replace(/\s+/g, "-");
    const formattedSection = sectionTitle?.toLowerCase().replace(/\s+/g, "-");
    const elementId = `${formattedModule}-${formattedSection}`;
    navigate(`/?st=${elementId}`);
  };

  return (
    <>
      <div className="py-1 px-3" style={{ maxWidth: "800px", width: "100%" }}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="position-relative w-100">
            <span
              className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
              style={{ pointerEvents: "none" }}
            >
              <FaSearch size={18} />
            </span>

            <input
              type="text"
              className="form-control fs-6 py-2 ps-4 pe-5 text-gray-700"
              name="search"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="How Can We Help You?"
              autoComplete="off"
            />

            {(suggestions.length > 0 || suggestions2.length > 0) && (
              <div
                className="dropdown-menu show w-100 mt-1 shadow-sm border rounded overflow-auto"
                style={{ maxHeight: "450px" }}
              >
                {suggestions?.length > 0 && (
                  <>
                    <h6 className="dropdown-header text-muted fs-6">FAQs</h6>
                    {suggestions.map((s: any, idx) => (
                      <button
                        key={`faq-${idx}`}
                        className="dropdown-item text-wrap"
                        onClick={() => handleSuggestionClick(s?.id)}
                      >
                        {s.question}
                      </button>
                    ))}
                    <div className="dropdown-divider"></div>
                  </>
                )}

                {suggestions2.length > 0 && (
                  <>
                    <h6 className="dropdown-header text-muted fs-6">Docs</h6>
                    {suggestions2.map((docGroup: any, idx) => (
                      <div key={`module-${idx}`}>
                        <h6 className="dropdown-header text-dark fw-bold">
                          {docGroup?.module}
                        </h6>
                        {docGroup.sections.map((section: any, i: number) => (
                          <button
                            key={`section-${i}`}
                            className="dropdown-item text-wrap"
                            onClick={() =>
                              handleSuggestion2Click(
                                docGroup.id,
                                section.sectionTitle,
                                docGroup.module
                              )
                            }
                          >
                            {section.sectionTitle}
                          </button>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchDocFaqs;
