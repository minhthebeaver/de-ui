import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { Switch as AntdSwitch } from 'antd';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';

import 'antd/dist/antd.css';
import './style.scss';

const customStyles: any = {
  control: styles => ({
    ...styles,
    width: 500,
  }),

  menu: (provided, state) => ({
    ...provided,
    width: 500,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    display: 'none',
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: 'none',
  }),
};

const NoOptionsMessage = props => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className="custom-css-class">No article found!</span>
    </components.NoOptionsMessage>
  );
};

const getArticleById = async (id: any) => {};

export function HomePage() {
  const [article, setArticle]: any = useState(null);
  const runTimeRef: any = useRef();
  const indexRef: any = useRef(false);

  const promiseOptions = useDebouncedCallback(async (inputValue: string) => {
    runTimeRef.current.value = '';

    const { data } = await axios({
      url: 'http://localhost:3002/v1/articles',
      params: {
        title: inputValue,
        index: indexRef.current,
      },
    });

    runTimeRef.current.value = `${data.time}ms  `;

    return data.data.map((item: any) => ({
      value: item._id,
      label: item.title,
    }));
  }, 1000);

  const renderAuthors = (authors: any) => {
    if (!authors?.length) {
      return null;
    }

    return (
      <>
        <span className="descriptor">Authors:</span>
        {authors.map((item: any, i: any) => {
          const authorName = `${item[1]} ${item[0]}`;

          return (
            <>
              <a
                key={i}
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  authorName,
                )}`}
                data-bcup-haslogintext="no"
              >
                {authorName}
              </a>
              {i != authors.length - 1 && ', '}
            </>
          );
        })}
      </>
    );
  };

  const renderBody = () => {
    if (!article) {
      return <span>No article selected!</span>;
    }

    return (
      <div id="content-inner">
        <div id="abs">
          <h1 className="title mathjax">
            <span className="descriptor">Title:</span>
            {article.title}
          </h1>
          <div className="authors">{renderAuthors(article.authors_parsed)}</div>
          <blockquote className="abstract mathjax">
            <span className="descriptor">Abstract:</span>
            {article.abstract}
          </blockquote>

          <div className="metatable">
            <table summary="Additional metadata">
              <tbody>
                <tr>
                  <td className="tablecell label">Comments:</td>
                  <td className="tablecell comments mathjax">
                    {article.comments}
                  </td>
                </tr>
                {article['report-no'] && (
                  <tr>
                    <td className="tablecell label">Report&nbsp;number:</td>
                    <td className="tablecell jref">{article['report-no']}</td>
                  </tr>
                )}
                <tr>
                  <td className="tablecell label">Cite as:</td>
                  <td className="tablecell arxivid">
                    <span className="arxivid">
                      <a
                        href={`https://arxiv.org/abs/${article.id}`}
                        data-bcup-haslogintext="no"
                      >
                        arXiv:{article.id}
                      </a>{' '}
                      [{article.categories}]
                    </span>
                  </td>
                </tr>
                {article['journal-ref'] && (
                  <tr>
                    <td className="tablecell label">Journal&nbsp;reference:</td>
                    <td className="tablecell jref">{article['journal-ref']}</td>
                  </tr>
                )}

                {article.doi && (
                  <tr>
                    <td className="tablecell label">
                      <abbr title="Digital Object Identifier">Related DOI</abbr>
                      :
                    </td>
                    <td className="tablecell doi">
                      <a
                        className="link-https link-external"
                        data-doi="10.1103/PhysRevD.76.013009"
                        href="https://doi.org/10.1103/PhysRevD.76.013009"
                        rel="external noopener nofollow"
                        data-bcup-haslogintext="no"
                      >
                        {`https://doi.org/${article.doi}`}
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const getArticle = async (id: any) => {
    const { data } = await axios({
      url: `http://localhost:3002/v1/articles/${id}`,
      params: { index: indexRef.current },
    });

    setArticle(data);
  };

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React Boilerplate application homepage"
        />
      </Helmet>
      <div className="de-header">
        <AsyncSelect
          className="search-area"
          placeholder="Search..."
          isClearable
          components={{ NoOptionsMessage }}
          styles={customStyles}
          // cacheOptions
          defaultOptions
          loadOptions={promiseOptions}
          onChange={(value: any) => getArticle(value.value)}
        />

        <div className="enable-index">
          <span>Enable Index</span>
          <AntdSwitch
            className="index-switch"
            onChange={(value: any) => (indexRef.current = value)}
          />
        </div>
        <div className="runtime-container">
          <span>Run Time</span>
          <input disabled ref={runTimeRef} type="text" />
        </div>
      </div>
      <div className="de-body">{renderBody()}</div>
      <div className="de-footer">
        <div className="subjects">
          <span>Data Engineering</span>
          <span>GV: TS. Võ Thị Ngọc Châu</span>
        </div>
        <div className="members">
          <span className="member-label">Nhóm TH:</span>
          <div className="member-name">
            <span>Trần Phạm Công Danh</span>
            <span>Phạm Tuấn Nghĩa</span>
          </div>
        </div>
      </div>
    </>
  );
}
