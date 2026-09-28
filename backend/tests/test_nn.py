import numpy as np

from glassbox.engine import Tensor
from glassbox.engine.nn import Linear, ReLU, Sequential


def make_net(seed=0):
    rng = np.random.default_rng(seed)
    return Sequential(Linear(4, 8, rng), ReLU(), Linear(8, 3, rng))


def test_linear_output_shape_and_parameters():
    layer = Linear(5, 2, np.random.default_rng(0))
    out = layer(Tensor(np.ones((3, 5))))
    assert out.shape == (3, 2)
    assert [p.shape for p in layer.parameters()] == [(5, 2), (2,)]


def test_sequential_collects_nested_parameters_with_names():
    names = [name for name, _ in make_net().named_parameters()]
    assert names == ["layers.0.weight", "layers.0.bias", "layers.2.weight", "layers.2.bias"]


def test_trace_returns_each_layer_output():
    outputs = make_net().trace(Tensor(np.ones((2, 4))))
    assert [o.shape for o in outputs] == [(2, 8), (2, 8), (2, 3)]
    assert (outputs[1] >= 0).all()


def test_zero_grad_clears_all_parameters():
    net = make_net()
    net(Tensor(np.ones((1, 4)))).sum().backward()
    assert all(p.grad is not None for p in net.parameters())
    net.zero_grad()
    assert all(p.grad is None for p in net.parameters())


def test_same_seed_gives_same_weights():
    a, b = make_net(3), make_net(3)
    for pa, pb in zip(a.parameters(), b.parameters(), strict=True):
        np.testing.assert_array_equal(pa.data, pb.data)
