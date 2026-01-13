import React, { useMemo, useState } from "react";

export type Category = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  parent_id: number | null;
};

type Node = Category & { children: Node[] };

function buildTree(items: Category[]): Node[] {
  const map = new Map<number, Node>();
  for (const c of items) map.set(c.id, { ...c, children: [] });

  const roots: Node[] = [];
  for (const c of items) {
    const node = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortRec = (nodes: Node[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
}

export function CategoryTree({ categories }: { categories: Category[] }) {
  const tree = useMemo(() => buildTree(categories), [categories]);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const toggle = (id: number) => setOpen((s) => ({ ...s, [id]: !s[id] }));

  const renderNode = (node: Node, level = 0) => {
    const isOpen = open[node.id] ?? true;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            marginLeft: level * 16,
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <button
            type="button"
            onClick={() => hasChildren && toggle(node.id)}
            disabled={!hasChildren}
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              cursor: hasChildren ? "pointer" : "default",
              opacity: hasChildren ? 1 : 0.35,
              color: "white",
              lineHeight: "30px",
              fontSize: 18,
            }}
            title={hasChildren ? (isOpen ? "Свернуть" : "Раскрыть") : "Нет дочерних"}
          >
            {hasChildren ? (isOpen ? "−" : "+") : "•"}
          </button>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <strong style={{ color: "white" }}>{node.name}</strong>
              <span style={{ opacity: 0.75, color: "white" }}>/{node.slug}</span>
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.15)",
                  opacity: node.is_active ? 1 : 0.6,
                  color: "white",
                }}
              >
                {node.is_active ? "active" : "inactive"}
              </span>
            </div>

            <span style={{ fontSize: 12, opacity: 0.7, color: "white" }}>
              id: {node.id} · parent_id: {node.parent_id ?? "null"}
            </span>
          </div>
        </div>

        {hasChildren && isOpen && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {node.children.map((ch) => renderNode(ch, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{tree.map((n) => renderNode(n))}</div>;
}
