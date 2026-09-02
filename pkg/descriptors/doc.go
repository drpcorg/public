// Package descriptors exists to host the tests that span every vendored
// chain API's protobuf descriptors (pkg/cosmos, pkg/sui, ...) rather than a
// single chain's. It ships no code: the guarantees live in the test binary,
// which blank-imports every descriptor package this module publishes - a new
// chain package gets added to those imports so the guarantees cover it.
package descriptors
