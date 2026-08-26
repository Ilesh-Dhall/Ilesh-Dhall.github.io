Neural Style Transfer (NST) enables the generation of artistic images by combining the semantic content of one image with the visual characteristics of another. Despite its effectiveness, the computational cost and parameter count of the underlying neural networks can make NST impractical for resource-constrained environments.

This project investigates the use of **fine-grained neural network pruning** to reduce the computational and memory footprint of a VGG-19-based neural style transfer pipeline while preserving the quality of its stylized outputs.

Rather than applying a uniform pruning ratio across the network, the approach analyzes the sensitivity of individual convolutional layers to different sparsity levels and uses this information to determine layer-specific pruning configurations. The compressed model reduces the parameter count from **20.02M to 3.02M** and the model size from **76.39 MiB to 11.52 MiB**, achieving a **6.64× reduction in model size**, or approximately **85% parameter reduction**.

## Motivation

Neural Style Transfer typically relies on deep convolutional networks to extract meaningful representations of image content and style. These networks contain a large number of parameters, resulting in considerable memory and computational requirements.

This becomes particularly relevant when deploying NST systems on constrained hardware or when generating stylized images repeatedly.

The central objective of this work was therefore to investigate:

> **How aggressively can a neural style transfer model be compressed while retaining the characteristics necessary for high-quality stylization?**

A key consideration is that different layers of a neural network do not contribute equally to the final representation. Uniformly pruning every layer by the same amount may therefore remove parameters that are significantly more important than others.

This motivates a **sensitivity-guided pruning strategy**.

## Methodology

The neural style transfer pipeline is built around a pre-trained **VGG-19** network using the original Caffe weights.

The stylized image is optimized using a combination of content, style, and total variation objectives.

The **content loss** encourages the generated image to preserve the semantic structure of the content image, while the **style loss** measures the similarity between the generated image and the reference artwork in feature space. A **total variation loss** is additionally used to encourage spatial smoothness and suppress unwanted high-frequency noise.

The overall process consists of four stages:

1. Establish a baseline neural style transfer pipeline using VGG-19.
2. Measure the sensitivity of individual convolutional layers to different sparsity levels.
3. Apply fine-grained L1-norm pruning according to the observed layer sensitivities.
4. Fine-tune the resulting compressed model to recover the quality lost during pruning.

![Architecture](/projects/deep-neural-compression/architecture.png)

## Sensitivity Analysis

The first stage of the compression process is to understand how different layers respond to pruning.

For each convolutional layer, sparsity levels ranging from **40% to 90%** were evaluated in increments of 10%. Each configuration was evaluated for **500 optimization iterations**, resulting in **48,000 iterations** across the complete sensitivity analysis.

The resulting loss measurements provide an estimate of how sensitive each layer is to increasing levels of sparsity.

![Sensitivity Analysis](/projects/deep-neural-compression/analysis.jpg)

The analysis revealed that the convolutional layers do not respond uniformly to pruning. In particular, earlier layers tend to exhibit greater sensitivity to aggressive pruning, while deeper layers can generally tolerate higher sparsity levels.

This observation motivates assigning **different pruning ratios to different layers**, rather than applying a single global sparsity ratio.

### Layer-Level Sensitivity

The behavior of individual layers can be examined through their corresponding sensitivity curves.

For example, the Conv.10 curve illustrates the change in optimization behavior as the sparsity of that layer increases.

![Sensitivity Curve](/projects/deep-neural-compression/SensitivityCurve.png)

These measurements provide the basis for selecting the final sparsity configuration used during compression.

## Fine-Grained Pruning

After determining the sensitivity of the convolutional layers, pruning is performed using the **L1 norm of individual weights**.

For each layer, weights with smaller L1 magnitude are considered less important and are removed according to the sparsity level selected from the sensitivity analysis.

Unlike structured pruning, which removes entire filters or channels, fine-grained pruning operates at the individual-weight level. This allows the compression process to target parameters more selectively.

The resulting sparse network is subsequently fine-tuned using the neural style transfer objectives to compensate for the degradation introduced by pruning.

## Compression Results

The final pruning configuration produces a substantial reduction in the size of the VGG-19 model.

| Model | Parameters | Model Size | Compression |
| --- | ---: | ---: | ---: |
| VGG-19 (original) | 20.02M | 76.39 MiB | Baseline |
| VGG-19 (pruned) | 3.02M | 11.52 MiB | **6.64×** |

The pruned model contains approximately **85% fewer parameters** than the original model.

The compressed model therefore retains only approximately 15% of the original parameter count while reducing its storage footprint by more than six times.

The objective, however, is not compression in isolation. The effectiveness of the approach depends on whether the resulting model continues to produce visually meaningful stylizations.

## Qualitative Results

The qualitative results compare the content image, reference style image, and stylized outputs produced by the compressed network.

![Style Transfer Outputs](/projects/deep-neural-compression/Outputs.png)

Despite the substantial reduction in parameters, the pruned model retains the major structural and stylistic characteristics of the generated images.

This suggests that a considerable portion of the original network's parameters can be removed without eliminating the representations required for neural style transfer.

## Discussion

The results demonstrate that the parameter importance of a neural network is not uniformly distributed across its layers.

Applying the same sparsity level everywhere would ignore these differences and could unnecessarily damage more sensitive layers. By first measuring layer-level sensitivity and then assigning pruning ratios accordingly, the compression process can allocate sparsity more selectively.

The resulting **6.64× reduction in model size** demonstrates the potential of sensitivity-guided fine-grained pruning for reducing the resource requirements of neural style transfer.

More broadly, the experiment highlights an important principle in neural network compression:

> **Effective compression is not simply about removing parameters, but about identifying which parameters can be removed with minimal impact on the behavior of the model.**

## Conclusion

This project explored a sensitivity-guided approach to compressing a VGG-19-based neural style transfer pipeline.

Through layer-wise sensitivity analysis, fine-grained L1-norm pruning, and subsequent fine-tuning, the model was reduced from **20.02M to 3.02M parameters**, achieving a **6.64× reduction in model size** while retaining the essential visual characteristics of neural style transfer.

The work provides an early exploration of how **fine-grained, sensitivity-aware compression** can make deep learning models more practical for environments where memory and computational resources are limited.