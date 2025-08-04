import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa6";
import { DocumentContent } from "../../../helper/DocumentsJSONData";
import { useSearchParams } from "react-router-dom";

export default function DocumentPage() {
  const sections = DocumentContent.filter(
    (item) => typeof item === "object" && !Array.isArray(item)
  );

  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [searchParams] = useSearchParams();
  const scrollToId = searchParams.get("st");

  const scrollTo = (id: string) => {
    contentRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const defaultScolled = DocumentContent[0].id;
    console.log("default", defaultScolled);
    const targetId = scrollToId || defaultScolled;
    const el = contentRefs.current[targetId];
    console.log("el", el);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const matched = DocumentContent.find((section) =>
        section.sections?.some(
          (sub) =>
            (sub.id ||
              `${section.id}-${sub.title}`
                .toLowerCase()
                .replace(/\s+/g, "-")) === targetId
        )
      );

      if (matched) {
        setExpandedSections((prev) => new Set(prev).add(matched.id));
      }

      setActiveId(targetId);
    }
  }, [scrollToId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top,
          }))
          .sort((a, b) => a.top - b.top);
        if (visible.length > 0) {
          setActiveId(visible[0].id);
        }
      },
      {
        root: document.getElementById("main-content"),
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0.1,
      }
    );

    Object.values(contentRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeId) return;

    buttonRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });

    const found = sections.find((section) => {
      if ("sections" in section) {
        return section?.sections?.some((sub: any) => {
          const subId =
            sub.id ||
            `${section.id}-${sub.title}`.toLowerCase().replace(/\s+/g, "-");
          return subId === activeId;
        });
      } else {
        return section.id === activeId;
      }
    });

    if (found && "id" in found) {
      setExpandedSections((prev) => new Set(prev).add(found.id));
    }
  }, [activeId]);

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <aside
          className="col-md-2 border-end bg-secondary-subtle px-3 py-4 overflow-auto"
          style={{
            maxHeight: "100vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
                aside::-webkit-scrollbar {
                    display: none;
                }
            `}
          </style>
          <nav className="d-flex flex-column gap-1">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              const isComplex = "sections" in section;

              return (
                <div key={section.id}>
                  {isComplex ? (
                    <>
                      <button
                        onClick={() => {
                          setExpandedSections((prev) => {
                            const newSet = new Set(prev);
                            if (newSet.has(section.id)) {
                              newSet.delete(section.id);
                            } else {
                              newSet.add(section.id);
                            }
                            return newSet;
                          });
                        }}
                        className="btn btn-outline-none d-flex justify-content-between align-items-center w-100 text-start fw-bold text-dark"
                      >
                        {section.title}
                        {isExpanded ? (
                          <FaChevronDown size={16} />
                        ) : (
                          <FaChevronRight size={16} />
                        )}
                      </button>
                      {isExpanded && (
                        <ul
                          className="list-unstyled"
                          style={{ fontSize: "14px" }}
                        >
                          {section?.sections?.map((sub: any) => {
                            const subId =
                              sub.id ||
                              `${section.id}-${sub.title}`
                                .toLowerCase()
                                .replace(/\s+/g, "-");
                            return (
                              <li key={subId}>
                                <button
                                  ref={(el) => {
                                    buttonRefs.current[subId] = el;
                                  }}
                                  onClick={() => scrollTo(subId)}
                                  className={clsx(
                                    "btn btn-outline-none w-100 text-start fw-semibold border-0 shadow-none",
                                    activeId === subId
                                      ? "btn-secondary fw-bold"
                                      : "btn-outline-none"
                                  )}
                                >
                                  {sub.title}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={clsx(
                        "btn btn-outline-none w-100 text-start fw-bold border-0 shadow-none",
                        activeId === section.id && "btn-secondary"
                      )}
                    >
                      {section.title}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main
          id="main-content"
          className="container col-md-10 py-5 d-flex justify-content-center overflow-auto scroll-hide"
          style={{ maxHeight: "100vh", scrollBehavior: "smooth" }}
        >
          <div className="col-lg-8 col-md-8 col-8 px-3 px-md-4 bg-white rounded ">
            <style>
              {`
            .scroll-hide::-webkit-scrollbar {
              display: none;
            }
            .scroll-hide {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
          `}
            </style>

            {sections.map((section) => {
              if ("sections" in section) {
                return (
                  <div key={section.id} className="mb-5">
                    <h2
                      className="h4 mb-1 text-start fw-bold text-dark pb-2"
                      style={{ fontSize: "30px" }}
                    >
                      {section.title}
                    </h2>

                    <div className="p-4 rounded border">
                      {section?.sections?.map((sub: any) => {
                        const id =
                          sub.id ||
                          `${section.id}-${sub.title}`
                            .toLowerCase()
                            .replace(/\s+/g, "-");

                        return (
                          <div
                            key={id}
                            id={id}
                            ref={(el) => {
                              contentRefs.current[id] = el;
                            }}
                            className="mb-5 scroll-mt-24"
                          >
                            <h3
                              className="fw-semibold mb-2 text-start text-dark d-flex align-items-start gap-2"
                              style={{ fontSize: "18px" }}
                            >
                              <span
                                className="mt-2 d-inline-block"
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: "#212529",
                                }}
                              ></span>
                              {sub.title}
                            </h3>

                            <p
                              className="text-secondary text-start"
                              style={{
                                whiteSpace: "pre-wrap",
                                fontSize: "16px",
                              }}
                            >
                              {sub.content}
                            </p>

                            {sub.images?.map((img: any, i: number) => (
                              <div key={i} className="mb-4">
                                <p
                                  className="text-start"
                                  style={{
                                    fontSize: "16px",
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {img.title}
                                </p>
                                <img
                                  src={img.src}
                                  alt={img.caption}
                                  className="img-fluid rounded"
                                />
                                {/* <p className="text-muted small text-start">
                                  {img.caption}
                                </p> */}
                              </div>
                            ))}

                            <p
                              className="text-secondary text-start"
                              style={{
                                whiteSpace: "pre-wrap",
                                fontSize: "16px",
                              }}
                            >
                              {sub.content2}
                            </p>

                            {sub.images2?.map((img: any, i: number) => (
                              <div key={i} className="mb-4">
                                <p
                                  className="text-start"
                                  style={{
                                    fontSize: "16px",
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {img.title}
                                </p>
                                <img
                                  src={img.src}
                                  alt={img.caption}
                                  className="img-fluid rounded"
                                />
                                {/* <p className="text-muted small text-start">
                                  {img.caption}
                                </p> */}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } else if ("title" in section && "content" in section) {
                return (
                  <div
                    key={section.id}
                    id={section.id}
                    ref={(el) => {
                      contentRefs.current[section.id] = el;
                    }}
                    className="scroll-mt-24 mb-5"
                  >
                    <h2
                      className="h4 mb-3 text-start fw-bold text-dark pb-2"
                      style={{ whiteSpace: "pre-wrap", fontSize: "30px" }}
                    >
                      {section.title}
                    </h2>
                    <div className=" p-4 rounded border">
                      <p
                        className="text-start text-secondary"
                        style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}
                      >
                        {section.content}
                      </p>

                      {section.features && (
                        <ul className="ps-4 list-disc ps-5 marker:text-gray-700">
                          {section.features.map((f: any, i: number) => (
                            <li key={i} className="mb-2 text-start">
                              <strong
                                style={{
                                  whiteSpace: "pre-wrap",
                                  fontSize: "18px",
                                }}
                              >
                                {f.title}
                              </strong>{" "}
                              <span
                                className="text-muted"
                                style={{
                                  whiteSpace: "pre-wrap",
                                  fontSize: "16px",
                                }}
                              >
                                {f.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
