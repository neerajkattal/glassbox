import type { ConceptId } from "../../missions/digitIsland";

/**
 * Math-mode content for each concept. Formulas are language-neutral; the code
 * snippets are taken from backend/glassbox/engine so learners can find them.
 */
export const CONCEPT_MATH: Record<ConceptId, { emoji: string; formula: string; code: string }> = {
  training: {
    emoji: "🏋️",
    formula: "L = −(1/N) · Σ log p(correct digit)",
    code: `# backend/glassbox/training/session.py
loss = cross_entropy(self.model(Tensor(images)), labels)
loss.backward()          # work out how each knob affected the loss
self.optimizer.step()    # nudge every knob a little`,
  },
  neuron: {
    emoji: "💡",
    formula: "a = σ(w₁x₁ + w₂x₂ + … + w₇₈₄x₇₈₄ + b)\nσ(z) = 1 / (1 + e⁻ᶻ)",
    code: `# backend/glassbox/engine/tensor.py
def sigmoid(self):
    value = 1.0 / (1.0 + np.exp(-self.data))`,
  },
  weights: {
    emoji: "🎛️",
    formula: "a⁽¹⁾ = σ(W⁽¹⁾x + b⁽¹⁾)\nW⁽¹⁾ is 784 × 16 = 12,544 knobs",
    code: `# backend/glassbox/engine/nn.py
class Linear(Module):
    def forward(self, x):
        return x @ self.weight + self.bias`,
  },
  learningRate: {
    emoji: "👣",
    formula: "w ← w − η · ∂L/∂w     (η = learning rate)",
    code: `# backend/glassbox/engine/optim.py
v -= self.lr * p.grad
p.data += v`,
  },
  gradientDescent: {
    emoji: "⛰️",
    formula: "∇L = (∂L/∂w₁, …, ∂L/∂wₙ)\nstep against the gradient: w ← w − η∇L",
    code: `# backend/glassbox/engine/tensor.py
for node in reversed(order):   # chain rule, output → input
    node._backward()`,
  },
};
