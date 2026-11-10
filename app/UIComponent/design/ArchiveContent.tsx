"use client";
import parse, { domToReact, Element, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import manifest from "@/generated/public-assets-manifest.json";

const assets = new Map<string, string>();
Object.entries(manifest).forEach(([directory, names]) => names.forEach(name => {
  const url = `${directory === "/" ? "" : directory}/${name}`;
  assets.set(url.toLowerCase(), url);
}));
function localAsset(value: string) {
  if (!value) return null;
  const local = value.replace(/^https?:\/\/(?:www\.)?besindia\.(?:com|co\.in)/i, "");
  if (/^(?:https?:|\/\/)/i.test(local)) return undefined;
  return assets.get(`/${local.replace(/^\/+/, "").split(/[?#]/)[0]}`.toLowerCase()) || null;
}
export default function ArchiveContent({ html }: { html: string }) {
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return;
      if (node.name === "img") {
        const asset = localAsset(node.attribs.src);
        if (asset === null) return <div className="archive-photo-unavailable">Photograph unavailable in this archive</div>;
        return <img src={asset || node.attribs.src} alt={node.attribs.alt || "A moment from the BES event archive"} loading="lazy" className="archive-photo" />;
      }
      if (node.name === "a" && /\.pdf(?:$|[?#])/i.test(node.attribs.href || "")) {
        const asset = localAsset(node.attribs.href);
        if (asset === null) return <span className="archive-resource-unavailable" title="This document is not available in the archive">{domToReact(node.children as DOMNode[], options)} <small>(document unavailable)</small></span>;
        return <a href={asset || node.attribs.href} target="_blank" rel="noopener noreferrer">{domToReact(node.children as DOMNode[], options)}</a>;
      }
    },
  };
  return <div className="archive-content">{parse(html, options)}</div>;
}
