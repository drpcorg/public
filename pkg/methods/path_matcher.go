package specs

import (
	"strings"
)

// pathMatcher resolves a concrete REST path against a set of registered
// templates and reports both the matched template and the wildcard captures.
//
// Templates look like "GET#/v2/accounts/*". The HTTP verb is treated as the
// first trie segment so that GET and POST on the same path live on different
// branches automatically. "*" is the only wildcard form supported - it matches
// exactly one path segment and the concrete value is captured in order.
//
// pathMatcher is immutable after construction, so callers can share an
// instance across goroutines without any locking. Build it once at startup
// (e.g. while loading method specs) and reuse it for every request.
type pathMatcher struct {
	root *pathNode
}

type pathNode struct {
	children map[string]*pathNode
	wildcard *pathNode
	// template is the original registered template string. A non-empty value
	// means this node terminates a registered path; we use it both as the
	// "terminated" marker and as the value to return from Match.
	template string
}

// newPathMatcher builds an immutable matcher from a set of templates. Each
// template has the form "VERB#/seg/seg/*" with "*" used for wildcard segments.
// Duplicate templates are accepted - the last one wins, which mirrors how
// registering twice with the same string would behave anyway.
func newPathMatcher(templates []string) *pathMatcher {
	m := &pathMatcher{root: newPathNode()}
	for _, t := range templates {
		m.add(t)
	}
	return m
}

func newPathNode() *pathNode {
	return &pathNode{children: make(map[string]*pathNode)}
}

func (m *pathMatcher) add(template string) {
	current := m.root
	for _, seg := range splitTemplate(template) {
		if seg == "*" {
			if current.wildcard == nil {
				current.wildcard = newPathNode()
			}
			current = current.wildcard
			continue
		}
		child, ok := current.children[seg]
		if !ok {
			child = newPathNode()
			current.children[seg] = child
		}
		current = child
	}
	current.template = template
}

// Match looks up fullPath ("VERB#/seg/seg/...") in the trie. It walks segments
// left-to-right and prefers literal children over the wildcard at each level -
// there is no backtracking, so a template like "GET#/blocks/*" will not be
// tried when "GET#/blocks/latest" also matches.
//
// On success it returns the original template string, the wildcard captures
// in path order, and true.
func (m *pathMatcher) Match(fullPath string) (template string, pathParams []string, ok bool) {
	current := m.root
	var captures []string
	for _, seg := range splitTemplate(fullPath) {
		if child, found := current.children[seg]; found {
			current = child
			continue
		}
		if current.wildcard != nil {
			captures = append(captures, seg)
			current = current.wildcard
			continue
		}
		return "", nil, false
	}
	if current.template == "" {
		return "", nil, false
	}
	return current.template, captures, true
}

// splitTemplate turns "VERB#/a/b/c" into ["VERB", "a", "b", "c"]. The HTTP
// verb is intentionally hoisted to the first segment so the trie naturally
// partitions GET/POST/... branches. Empty segments (from leading or repeated
// slashes) are dropped so callers don't have to normalise paths first.
func splitTemplate(s string) []string {
	verb, rest, _ := strings.Cut(s, "#")
	parts := strings.Split(strings.TrimPrefix(rest, "/"), "/")
	out := make([]string, 0, 1+len(parts))
	if verb != "" {
		out = append(out, verb)
	}
	for _, p := range parts {
		if p == "" {
			continue
		}
		out = append(out, p)
	}
	return out
}
