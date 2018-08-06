import React from 'react';
import styles from "./announcements/announcements.scss";
import ContentLoader, { Facebook } from "react-content-loader";

const newsLoader = () =>
  <ContentLoader
    height={250}
    width={200}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#dddddd"
  >
    <rect x="0" y="0" rx="0" ry="0" width="200" height="120" />
    <rect x="0" y="150" rx="0" ry="0" width="150" height="20" />
    <rect x="0" y="180" rx="0" ry="0" width="90" height="20" />
    <rect x="0" y="220" rx="0" ry="0" width="85" height="20" />
    <rect x="141.5" y="227.23" rx="0" ry="0" width="60" height="20" />
  </ContentLoader>;

export default newsLoader;
